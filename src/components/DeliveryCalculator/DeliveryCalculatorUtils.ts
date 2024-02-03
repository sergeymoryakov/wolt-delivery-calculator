export function calcSmallOrderSurcharge(cartValue: number) {
    if (cartValue >= 10) {
        return 0;
    } else {
        return parseFloat((10 - cartValue).toFixed(2));
    }
}

export function isFreeDelivery(cartValue: number) {
    if (cartValue >= 200) {
        return true;
    } else {
        return false;
    }
}

export function calcDistanceFee(deliveryDistance: number) {
    // delivery price is eur 1 for each 500 m distance
    return Math.ceil(deliveryDistance / 500);
}

export function calcItemsSurcharge(numberOfItems: number) {
    // add eur 0.5 for the 5th and every other item
    let fee: number = (numberOfItems - 4) * 0.5;
    // add eur 1.2 if > 12 items in order
    if (numberOfItems > 12) {
        fee += 1.2;
    }
    return fee;
}

// convert date to YYYY-MM-DDTHH:mm format
export function formatDateForInput(date: Date) {
    return date.toISOString().slice(0, 16);
}

// check if rush hour (Friday between 15:00 and 19:00)
export function isRushHour(date: Date) {
    const dayOfWeek: number = date.getDay();
    const hour: number = date.getHours();
    return dayOfWeek === 5 && hour > 15 && hour < 19;
}

// cap delivery fee at eur 15
export function capDeliveryFee(fee: number) {
    if (fee > 15) {
        return 15;
    } else {
        return fee;
    }
}
