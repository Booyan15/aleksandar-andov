import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkRateLimit, clearRateLimitBuckets } from "../src/lib/rate-limit";
import {
  generateSmsUrl,
  normalizeMacedonianPhoneNumber
} from "../src/lib/sms";

describe("Macedonian phone normalization", () => {
  it("normalizes local mobile numbers", () => {
    assert.equal(normalizeMacedonianPhoneNumber("070123456"), "+38970123456");
    assert.equal(normalizeMacedonianPhoneNumber("071 123 456"), "+38971123456");
    assert.equal(normalizeMacedonianPhoneNumber("(071) 123-456"), "+38971123456");
  });

  it("keeps already normalized Macedonian mobile numbers", () => {
    assert.equal(normalizeMacedonianPhoneNumber("+38970123456"), "+38970123456");
    assert.equal(normalizeMacedonianPhoneNumber("0038970123456"), "+38970123456");
  });

  it("rejects malformed or non-Macedonian numbers", () => {
    assert.equal(normalizeMacedonianPhoneNumber("02123456"), null);
    assert.equal(normalizeMacedonianPhoneNumber("+38170123456"), null);
    assert.equal(normalizeMacedonianPhoneNumber("07012345"), null);
  });

  it("encodes SMS body content safely", () => {
    const url = generateSmsUrl("070123456", "Тест <script>alert(1)</script>");

    assert.equal(
      url,
      "sms:+38970123456?body=%D0%A2%D0%B5%D1%81%D1%82%20%3Cscript%3Ealert(1)%3C%2Fscript%3E"
    );
  });
});

describe("rate limiting", () => {
  it("blocks requests after the configured limit until the window resets", () => {
    clearRateLimitBuckets();

    const first = checkRateLimit({ key: "login:test", limit: 2, windowMs: 1000, now: 1000 });
    const second = checkRateLimit({ key: "login:test", limit: 2, windowMs: 1000, now: 1100 });
    const third = checkRateLimit({ key: "login:test", limit: 2, windowMs: 1000, now: 1200 });
    const afterReset = checkRateLimit({ key: "login:test", limit: 2, windowMs: 1000, now: 2101 });

    assert.equal(first.allowed, true);
    assert.equal(second.allowed, true);
    assert.equal(third.allowed, false);
    assert.equal(afterReset.allowed, true);
  });
});
