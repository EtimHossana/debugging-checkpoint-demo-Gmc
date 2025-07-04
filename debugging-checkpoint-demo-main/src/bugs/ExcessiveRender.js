import { useEffect, useState } from "react";
import { Button, Box, Text, Heading } from "grommet";
import { AddCircle, SubtractCircle } from "grommet-icons";
import { useQuery } from "@tanstack/react-query";

import Template from "./BugPageTemplate";
import { expect, useBugTest } from "./tests";

const Bug = () => {
  return (
    <Template bug={bug}>
      <ExtravagantEmeraldAshBorer />
    </Template>
  );
};

const ExtravagantEmeraldAshBorer = () => {
  const {
    isFetching,
    isSuccess,
    refetch,
    data, // access data directly here
  } = useQuery({
    queryKey: ["promotion", { name: bug.name }],
    queryFn: ({ queryKey: [, { name }] }) => fetchBugByName(name),
    select: (data) => data?.promotion ?? [],
  });

  useBugTest("should display quantity picker", ({ findByTestId }) => {
    expect(findByTestId("quantity")).to.exist;
  });

  if (isFetching) {
    return <Text>Loading...</Text>; // Show a loading message until the query is complete
  }

  if (!isSuccess || !data) {
    return <Text>Error: Unable to fetch promotion data</Text>; // Handle error state
  }

  return (
    <>
      <Heading level={3}>{bug.name}</Heading>
      <QuantityPicker initialQuantity={1} onQuantityChange={refetch} />
    </>
  );
};

function QuantityPicker({ initialQuantity = 1, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleChange = (newQty) => {
    setQuantity(newQty);
    onQuantityChange(); // Trigger the refetch
  };

  return (
    <Box data-test="quantity">
      <Box
        direction="row"
        gap="small"
        align="center"
        margin={{ bottom: "medium" }}
      >
        <Button
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
          icon={<SubtractCircle />}
        />
        <Text color="text-weak" data-test="level">
          {quantity}
        </Text>
        <Button
          primary
          onClick={() => handleChange(quantity + 1)}
          disabled={quantity >= 100}
          icon={<AddCircle />}
        />
      </Box>
    </Box>
  );
}

async function fetchBugByName(name) {
  const res = await fetch(`/api/bugs.json`);
  const data = await res.json();
  return data.bugs.find((item) => item.name === name);
}

export const bug = {
  title: "Excessive Render",
  subtitle:
    "this extravagant emerald ash borer can cause a component to re-render too much",
  name: "Extravagant Emerald Ash Borer",
  price: "$1099.99",
  route: "/bug/excessive",
  component: Bug,
};

export default Bug;
