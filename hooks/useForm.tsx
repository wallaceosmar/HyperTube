/* eslint-disable max-lines-per-function */
import React from "react";

type FormCallback<V> = (values: V) => Promise<V>;
type FormResolver<V> = (values: V) => FormErrors<V>;
export type FormErrors<V> = {
  [P in keyof V]?: string;
};

export type HookForm<V> = {
  values: V;
  errors: FormErrors<V>;
  handleChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  handleCancel: () => void;
};

export default function useForm<V>(
  callback: FormCallback<V>,
  resolver: FormResolver<V>,
  initialValues: V,
) {
  const [values, setValues] = React.useState<V>(initialValues);
  const [errors, setErrors] = React.useState<FormErrors<V>>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [hasSubmittingOnce, setHasSubmittingOnce] = React.useState<boolean>(
    false,
  );

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (values) {
      evt.persist();
      setIsSubmitting(false);
      setValues((oldValues) => ({
        ...oldValues,
        [evt.target.name]:
          evt.target.type === "checkbox"
            ? evt.target.checked
            : evt.target.value,
      }));
    }
  };

  React.useEffect(() => {
    if (hasSubmittingOnce) {
      setErrors(resolver(values));
    }
  }, [resolver, hasSubmittingOnce, values]);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrors(resolver(values));
    setIsSubmitting(true);
    setHasSubmittingOnce(true);
  };

  React.useEffect(() => {
    const launchCallback = async () => {
      const newValues = await callback(values);
      setIsSubmitting(false);
      // re-set values in case of rollback (e.g.: API error out of range 2XX)
      setValues(newValues);
    };

    if (isSubmitting && Object.keys(errors).length === 0) {
      launchCallback();
    }
  }, [callback, isSubmitting, errors, values]);

  const handleCancel = () => {
    setValues(initialValues);
    setErrors({});
    setHasSubmittingOnce(false);
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}
