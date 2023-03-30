import { Formik, Form, Field, ErrorMessage } from 'formik';

function NftForm() {
  return (
    <Formik
      initialValues={{
        name: '',
        vin: '',
        brand: '',
        model: '',
        year: '',
        country: '',
        image: null,
      }}
      onSubmit={(values) => {
        // Submit form
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="name" placeholder="Nom de la voiture" />
          <ErrorMessage name="name" />

          <Field type="text" name="vin" placeholder="Numéro VIN" />
          <ErrorMessage name="vin" />

          <Field type="text" name="brand" placeholder="Marque" />
          <ErrorMessage name="brand" />

          <Field type="text" name="model" placeholder="Modèle" />
          <ErrorMessage name="model" />

          <Field type="text" name="year" placeholder="Année d'immatriculation" />
          <ErrorMessage name="year" />

          <Field type="text" name="country" placeholder="Pays d'immatriculation" />
          <ErrorMessage name="country" />

          <Field type="file" name="image" accept="image/*" />
          <ErrorMessage name="image" />

          <button type="submit" disabled={isSubmitting}>
            Créer NFT
          </button>
        </Form>
      )}
    </Formik>
  );
}
