import * as React from 'react';
import renderer from 'react-test-renderer';

import { PoppinsText } from '../StyledText';

it(`renders correctly`, () => {
  const tree = renderer.create(<PoppinsText>Snapshot test!</PoppinsText>).toJSON();

  expect(tree).toMatchSnapshot();
});
