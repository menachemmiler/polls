import clsx from "clsx";

const responseForm = clsx(
  "min-h-screen",
  "max-w-3xl ",
  "mx-auto",
);

interface Props {
  children: React.ReactNode;
}

const ResponseForm = ({ children }: Props) => {
  return <div dir="rtl" className={responseForm}>{children}</div>;
};

export default ResponseForm;
