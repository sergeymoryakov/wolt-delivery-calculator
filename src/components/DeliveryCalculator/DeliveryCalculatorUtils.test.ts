import {
    calcSmallOrderSurcharge,
    isFreeDelivery,
    calcDistanceFee,
    calcItemsSurcharge,
    isRushHour,
    capDeliveryFee,
    formatDateForInput,
} from "./DeliveryCalculatorUtils";
import { describe, expect, it } from "vitest";

describe("#calcSmallOrderSurcharge", () => {
    it("returns 1.10 with 8.90", () => {
        expect(calcSmallOrderSurcharge(8.9)).toBe(1.1);
    });
    it("returns 4.50 with 5.50", () => {
        expect(calcSmallOrderSurcharge(5.5)).toBe(4.5);
    });
    it("returns 0 with 13", () => {
        expect(calcSmallOrderSurcharge(13)).toBe(0);
    });
});

describe("#isFreeDelivery", () => {
    it("returns true with 250", () => {
        expect(isFreeDelivery(250)).toBe(true);
    });
    it("returns false with 25", () => {
        expect(isFreeDelivery(25)).toBe(false);
    });
});

describe("#calcDistanceFee", () => {
    it("returns 3 with 1499", () => {
        expect(calcDistanceFee(1499)).toBe(3);
    });
    it("returns 3 with 1500", () => {
        expect(calcDistanceFee(1500)).toBe(3);
    });
    it("returns 4 with 1501", () => {
        expect(calcDistanceFee(1501)).toBe(4);
    });
});

describe("#calcItemsSurcharge", () => {
    it("returns 0 with 4", () => {
        expect(calcItemsSurcharge(4)).toBe(0);
    });
    it("returns 0.5 with 5", () => {
        expect(calcItemsSurcharge(5)).toBe(0.5);
    });
    it("returns 3 with 10", () => {
        expect(calcItemsSurcharge(10)).toBe(3);
    });
    it("returns 5.7 with 13", () => {
        expect(calcItemsSurcharge(13)).toBe(5.7);
    });
    it("returns 6.20 with 14", () => {
        expect(calcItemsSurcharge(14)).toBe(6.2);
    });
});

describe("#formatDateForInput", () => {
    it("returns 2024-02-01T06:50 with 2024-02-01T06:50:34.255Z", () => {
        const testDate = new Date("2024-02-01T06:50:34.255Z");
        expect(formatDateForInput(testDate)).toBe("2024-02-01T06:50");
    });
    it("returns 2024-02-16T16:30 with 2024-02-16T16:30:07.134Z", () => {
        const testDate = new Date("2024-02-16T16:30:07.134Z");
        expect(formatDateForInput(testDate)).toBe("2024-02-16T16:30");
    });
});

describe("#isRushHour", () => {
    it("returns true during rush hour on Friday", () => {
        const rushHourDate = new Date("2024-02-02T16:15:00.255Z");
        expect(isRushHour(rushHourDate)).toBe(true);
    });

    it("returns false outside rush hour on Friday", () => {
        const nonRushHourDate = new Date("2024-02-01T09:30:00.128Z");
        expect(isRushHour(nonRushHourDate)).toBe(false);
    });

    it("returns false on a day that is not Friday", () => {
        const nonFridayDate = new Date("2023-05-01T14:45:00.335Z");
        expect(isRushHour(nonFridayDate)).toBe(false);
    });
});

describe("#capDeliveryFee", () => {
    it("returns 15 with 18", () => {
        expect(capDeliveryFee(18)).toBe(15);
    });
    it("returns 13.7 with 13.7", () => {
        expect(capDeliveryFee(13.7)).toBe(13.7);
    });
    it("returns 2 with 2", () => {
        expect(capDeliveryFee(2)).toBe(2);
    });
});
