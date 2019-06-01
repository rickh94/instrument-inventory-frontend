import React from 'react';
import { shallow } from 'enzyme';
import TooltipIconButton from './TooltipIconButton';

describe('<TooltipIconButton />', () => {
  test('renders', () => {
    const wrapper = shallow(<TooltipIconButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
