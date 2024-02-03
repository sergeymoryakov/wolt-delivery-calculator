import { FormEvent, useState } from "react";
import {
    calcSmallOrderSurcharge,
    isFreeDelivery,
    calcDistanceFee,
    calcItemsSurcharge,
    isRushHour,
    capDeliveryFee,
    formatDateForInput,
} from "./DeliveryCalculatorUtils";
import "./DeliveryCalculator.css";

type DeliveryDetails = {
    cartValue: number | null;
    deliveryDistance: number | null;
    numberOfItems: number | null;
    orderTime: Date | null;
    deliveryPrice: number | null;
};

const INITIAL_DELIVERY_DETAILS: DeliveryDetails = {
    cartValue: null,
    deliveryDistance: null,
    numberOfItems: null,
    orderTime: null,
    deliveryPrice: null,
};

// *** TESTING SECTION - REMOVE IN PROD **
// function testFunction(argument: number) {
//     return Math.ceil(argument / 500);
// }
// const testResult: number = testFunction(1000);
// console.log("distance surcharge: ", testResult);

// if (import.meta.vitest) {
//     const { describe, expect, it } = import.meta.vitest;

//     describe("#testFunction", () => {
//         it("returns 3 with 1499", () => {
//             expect(testFunction(1499)).toBe(3);
//         });
//         it("returns 3 with 1500", () => {
//             expect(testFunction(1500)).toBe(3);
//         });
//         it("returns 4 with 1501", () => {
//             expect(testFunction(1501)).toBe(4);
//         });
//     });
// }
// *** TESTING SECTION ENDS HERE ***

function DeliveryCalculator() {
    // state
    const [deliveryDetails, setDeliveryDetails] = useState(
        INITIAL_DELIVERY_DETAILS
    );

    // update state
    function updateFields(fields: Partial<DeliveryDetails>) {
        setDeliveryDetails((prev) => {
            return { ...prev, ...fields };
        });
    }

    // activate delivery price calculation
    function onSubmit(e: FormEvent) {
        e.preventDefault();

        const fee: number | null = calculateDeliveryFee(deliveryDetails);

        if (fee !== null) {
            setDeliveryDetails((prevData) => ({
                ...prevData,
                deliveryPrice: fee,
            }));
        } else {
            alert(
                "Calculation may not be completed. Please make sure all input fields are filled."
            );
        }
    }

    // calculate delivery price
    function calculateDeliveryFee(
        deliveryDetails: DeliveryDetails
    ): number | null {
        const { cartValue, deliveryDistance, numberOfItems, orderTime } =
            deliveryDetails;

        // make sure all input fields are filled
        if (
            cartValue === null ||
            deliveryDistance === null ||
            numberOfItems === null ||
            orderTime === null
        ) {
            alert("I am sorry, please make sure all fields are filled.");
            return null;
        }

        let fee: number = 0;

        // free delivery for orders > eur 200
        if (isFreeDelivery(cartValue)) {
            return 0;
        }

        // calculate surcharge for orders < eur 10
        fee += calcSmallOrderSurcharge(cartValue);

        // calculate distance fee: eur 1 for each 500 m distance
        fee += calcDistanceFee(deliveryDistance);

        // add eur 0.5 surcharge for 5th and every other item in cart
        fee += calcItemsSurcharge(numberOfItems);

        // multiply x 1.2 if rush hour (3pm - 7pm in Friday)
        if (isRushHour(orderTime)) {
            fee = fee * 1.2;
        }

        // cap delivery fee at eur 15
        fee = capDeliveryFee(fee);

        // set fee for 2 decimals
        fee = parseFloat(fee.toFixed(2));
        return fee;
    }

    return (
        <div className="delivery-calculator">
            <form
                className="delivery-calculator__form"
                onSubmit={onSubmit}
                action=""
            >
                <h3>Delivery Fee Calculator</h3>
                <div className="delivery-calculator__inputs-grid">
                    <label htmlFor="cartValue">Cart Value </label>
                    <input
                        id="cartValue"
                        data-test-id="cartValue"
                        autoFocus
                        required
                        type="number"
                        value={deliveryDetails.cartValue ?? ""}
                        onChange={(e) =>
                            updateFields({
                                cartValue: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                            })
                        }
                    ></input>
                    <label htmlFor="deliveryDistance">Delivery distance </label>
                    <input
                        id="deliveryDistance"
                        data-test-id="deliveryDistance"
                        required
                        type="number"
                        value={deliveryDetails.deliveryDistance ?? ""}
                        onChange={(e) =>
                            updateFields({
                                deliveryDistance: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                            })
                        }
                    ></input>
                    <label htmlFor="numberOfItems">Number of items</label>
                    <input
                        id="numberOfItems"
                        data-test-id="numberOfItems"
                        required
                        type="number"
                        value={deliveryDetails.numberOfItems ?? ""}
                        onChange={(e) =>
                            updateFields({
                                numberOfItems: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                            })
                        }
                    ></input>
                    <label htmlFor="orderTime">Date & Time </label>
                    <input
                        id="orderTime"
                        data-test-id="orderTime"
                        type="datetime-local"
                        required
                        value={
                            deliveryDetails.orderTime
                                ? formatDateForInput(deliveryDetails.orderTime)
                                : ""
                        }
                        onChange={(e) =>
                            updateFields({
                                orderTime: e.target.value
                                    ? new Date(e.target.value)
                                    : null,
                            })
                        }
                    ></input>
                </div>
                <button
                    data-test-id="calculateButton"
                    className="delivery-calculator__button"
                    type="submit"
                >
                    Calculate delivery price
                </button>
                <p data-test-id="fee">
                    Delivery price:
                    <span> {deliveryDetails.deliveryPrice}€</span>
                </p>
            </form>
        </div>
    );
}

export default DeliveryCalculator;
