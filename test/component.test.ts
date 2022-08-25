import { mount } from '@vue/test-utils';
import Counter from '../src/components/Counter';

describe('Counter', () => {
  it('should render', () => {
    const wrapper = mount(Counter,{ props: { initial: 10 } });
    expect(wrapper.html()).toMatchSnapshot();
    const vm = wrapper.vm
    const input = vm.$el.querySelector('input')
    expect(input.value).toContain('10');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should be interactive', async () => {
    const wrapper = mount(Counter, { props: { initial: 0 } });
    const vm = wrapper.vm
    const input = vm.$el.querySelector('input')
    expect(input.value).toContain('0');

    expect(wrapper.find('.inc').exists()).toBe(true);

    await wrapper.find(".dec").trigger('click');

    const input2 = vm.$el.querySelector('input')
    expect(input2.value).toContain('1');

  });
});
