import { useCallback, useEffect, useState } from "react";
import { Box, Button, Heading, Text, TextInput } from "grommet";
import { AddCircle, SubtractCircle } from "grommet-icons";

import Template from "./BugPageTemplate";
import { isVolumeDiscount, calculateDiscount } from "../product-service";
import { expect, useBugTest } from "./tests";

const Bug = () => {
  return (
    <Template bug={bug}>
      <ConfoundingCricket />
    </Template>
  );
};

const ConfoundingCricket = () => {
  const [price, setPrice] = useState(bug.price);

  const recalculatePrice = useCallback((qty) => {
    const amount = parseCurrencyAsAmount(bug.price);
    const newAmount = qty * amount;
    const newPrice = formatAsCurrency(newAmount);

    setPrice(newPrice);
  }, []);

  return (
    <>
      <Heading level={3}>{bug.name}</Heading>
      <Text size="large" weight="bold">
        {price}
      </Text>
      <QuantityPicker
        initialQuantity={1}
        onQuantityChange={recalculatePrice}
        price={price}
      />
    </>
  );
};

function QuantityPicker({ initialQuantity = 1, price, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    onQuantityChange(quantity);
  }, [onQuantityChange, quantity]);

  useBugTest(
    "should be able to update quantity to 50",
    async ({ findByTestId }) => {
      const quantityInput = await findByTestId("quantity");
      expect(
        parseInt(quantityInput.value || quantityInput.innerText, 10)
      ).to.be.gte(50);
    }
  );

  const handleInputChange = (event) => {
    const next = parseInt(event.target.value, 10);
    if (!isNaN(next) && next >= 1 && next <= 100) {
      setQuantity(next);
    }
  };

  return (
    <Box>
      <Box
        direction="row"
        gap="small"
        align="center"
        margin={{ bottom: "medium" }}
      >
        <Button
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity <= 1}
          icon={<SubtractCircle />}
        />

        <TextInput
          value={quantity}
          type="number"
          min={1}
          max={100}
          onChange={handleInputChange}
          data-test="quantity"
        />

        <Button
          primary
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity >= 100}
          icon={<AddCircle />}
        />
      </Box>

      {isVolumeDiscount(quantity) && (
        <VolumeDiscount price={price} quantity={quantity} />
      )}
    </Box>
  );
}

function VolumeDiscount({ price, quantity }) {
  const discount = calculateDiscount(quantity);
  const savings = formatAsCurrency(parseCurrencyAsAmount(price) * discount);

  return (
    <Text data-test="discount" color="text-ok">
      Volume discount applies: {discount * 100}% (save {savings}!)
    </Text>
  );
}

function formatAsCurrency(amount) {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function parseCurrencyAsAmount(currency) {
  return Math.round(Number(currency.replace(/[^0-9.-]+/g, "")) * 100);
}

export const bug = {
  title: "Conditional Render",
  subtitle:
    "this confounding cricket may only appear when conditional rendering logic runs",
  name: "Confounding Cricket",
  price: "$5.99",
  route: "/bug/conditional",
  component: Bug,
};

export default Bug;
