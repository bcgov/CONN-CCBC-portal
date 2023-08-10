import EnumFilter from './EnumFilter';

/**
 * An enum filter that converts the input to a numerical value when submitting it
 */
export default class NumberEnumFilter extends EnumFilter<number> {
  castValue = (input) => Number(input) || null;
}
