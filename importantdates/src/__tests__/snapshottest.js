import {TestStuff} from '../testStuff';
import React from "react"
import renderer from "react-test-renderer"

describe('application launch', () => {
  it('should render App', () => {
    const tree = renderer.create(
          <TestStuff></TestStuff>
      ).toJSON();
      expect(tree).toMatchSnapshot("ImportantDates");
  });
});
