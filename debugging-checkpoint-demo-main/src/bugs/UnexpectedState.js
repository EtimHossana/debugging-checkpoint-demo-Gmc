import { useEffect, useState } from "react";
import { Box, Button, Heading, Text } from "grommet";
import { AddCircle, SubtractCircle } from "grommet-icons";

import Template from "./BugPageTemplate";
import { expect, useBugTest } from "./tests";

const Bug = () => {
  return (
    <Template bug={bug}>
      {/* passed a prop value as 1 since the initial value is rendered on mount */}
      <ShySpider level={1} />
    </Template>
  );
};

/**
 * Scenarios:
 * - Initial state
 * - Incorrect state update
 * - Stale state
 */
const ShySpider = (props) => {
  const [purchaseLevel, setPurchaseLevel] = useState(props.level);

  const handleOnLevelChange = (level) => {
    setPurchaseLevel(level);
  };

  useEffect(() => {});

  useBugTest("should display a level", ({ findByTestId }) => {
    expect(findByTestId("level").innerText).to.match(/Level \d+/);
  });

  useBugTest("should display a purchase summary", ({ findByTestId }) => {
    expect(findByTestId("summary").innerText).to.contain(
      findByTestId("level").innerText.toLowerCase()
    );
  });

  return (
    <>
      <Heading level={3}>{bug.name}</Heading>
      <BugAttributes
        initialLevel={props.level}
        onLevelChange={handleOnLevelChange}
      />
      {purchaseLevel ? <PurchaseSummary purchaseLevel={purchaseLevel} /> : null}
    </>
  );
};
//added a destructure instead of passing use state variable as a string
function BugAttributes({ initialLevel, onLevelChange }) {
  let [currentLevel, setCurrentValue] = useState(initialLevel);

  const onLevelUp = () => {
    setCurrentValue((currentLevel += 1));
    onLevelChange(currentLevel);
  };
  const onLevelDown = () => {
    setCurrentValue((currentLevel -= 1));
    onLevelChange(currentLevel);
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
          onClick={onLevelDown}
          disabled={currentLevel <= 1}
          icon={<SubtractCircle />}
        />
        <Text color="text-weak" data-test="level">
          Level {currentLevel}
        </Text>

        <Button
          primary
          onClick={onLevelUp}
          disabled={currentLevel >= 100}
          icon={<AddCircle />}
        />
      </Box>
    </Box>
  );
}

function PurchaseSummary({ purchaseLevel }) {
  return (
    <>
      <Heading level={3} margin={{ top: "medium" }}>
        summary
      </Heading>

      <Text data-test="summary" color="text-weak">
        You are purchasing a level {purchaseLevel} {bug.name}
      </Text>
    </>
  );
}

export const bug = {
  title: "Unexpected State Changes",
  subtitle:
    "this shy spider can cause component state to be wrong at first, updated incorrectly, or even become stale",
  name: "Shy Spider",
  price: "$23.99",
  route: "/bug/state",
  component: Bug,
};

export default Bug;
