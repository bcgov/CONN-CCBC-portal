import React from 'react';
import {
  FormProps,
  IChangeEvent,
  ErrorSchema,
  AjvError,
  withTheme,
} from '@rjsf/core';
import formTheme from '../../lib/theme/FormWithTheme';
import { customTransformErrors } from '../../lib/theme/customTransformErrors';
import {
  customFormats,
  customFormatsErrorMessages,
} from '../../data/jsonSchemaForm/customFormats';

interface CalculationSchemaFormProps<T> extends FormProps<T> {
  onCalculate?: (formData: T, updatedField?: keyof T) => T;
  theme?: object;
  onSubmit: any;
  formData: any;
}
interface CalculationSchemaFormState<T> {
  originalFormData: T | undefined;
  formData: T;
}

export default class CalculationSchemaForm<T> extends React.Component<
  CalculationSchemaFormProps<T>,
  CalculationSchemaFormState<T>
> {
  Form = withTheme(formTheme);
  transformErrors = (errors: AjvError[]) => {
    return customTransformErrors(errors, customFormatsErrorMessages);
  };
  state: CalculationSchemaFormState<T>;
  calculating = false;
  constructor(props: CalculationSchemaFormProps<T>) {
    super(props);
    const formData = this.props.formData
      ? (this.props.formData as T)
      : ({} as T);
    this.state = {
      originalFormData: formData,
      formData,
    };
  }

  isSavedForm = this.state?.formData
    ? Object.keys(this.state.formData).length
    : false;

  onChange(e: IChangeEvent<T>, es?: ErrorSchema): void {
    // Exit if we're calculating
    if (this.calculating) {
      return;
    }

    // Set the calculating flag to true to avoid an infinite loop
    this.calculating = true;

    // Pass through the new form data to re-render with the updated value
    this.setState({ formData: e.formData });

    // Get the updated field
    const updatedField = this.getUpdatedField(this.state.formData, e.formData);

    // Use setTimeout to call onCalculate, to let all the events fire to get everything synched up
    setTimeout(() => this.onCalculate(e.formData, updatedField));

    // Call the onChange if it was passed in
    if (this.props.onChange) {
      this.props.onChange(e, es);
    }
  }

  getUpdatedField(oldFormData: any, newFormData: any): keyof T {
    // Iterate over the properties to find the changed value
    return Object.getOwnPropertyNames(newFormData).find((key) => {
      // If we have a primitive data type return the comparison
      switch (typeof newFormData[key]) {
        case 'boolean':
        case 'number':
        case 'string':
          //if the old formData has no key set for this form
          //then this is the updated section
          //Arrays are set as default null/undefined
          if(oldFormData === undefined){
            return true
          }
          return newFormData[key] !== oldFormData[key];
        default:
          // If it's undefined or null, return the comparison
          if (newFormData[key] === undefined || newFormData[key] === null) {
            return newFormData[key] !== oldFormData[key];
          }
          // We have either another JSON object or Array
          // Return a recursive call to getUpdatedField
          return this.getUpdatedField(oldFormData[key], newFormData[key]);
      }
    }) as keyof T;
  }

  onCalculate(formData: T, updatedField: keyof T): void {
    let updatedFormData = formData;

    // Perform the calculation if it was passed in
    if (this.props.onCalculate) {
      // Get the updated form data
      updatedFormData = this.props.onCalculate(formData, updatedField);
    }

    // Update the form
    this.setState({ formData: updatedFormData });
    // Set calculating to false
    this.calculating = false;
  }

  render(): React.ReactNode {
    // Display the form
    return (
      <this.Form
        {...this.props}
        schema={this.props.schema}
        formData={this.state.formData}
        onChange={(e: IChangeEvent<T>, es?: ErrorSchema) =>
          this.onChange(e, es)
        }
        customFormats={customFormats}
        transformErrors={this.transformErrors}
        noHtml5Validate
        omitExtraData
        showErrorList={false}
      >
        {this.props.children}
      </this.Form>
    );
  }
}
