import { useParams } from "react-router-dom";
import NotFoundPage from "./404Page";
import Index from "../features/responses/Index";

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

interface FormResponseProps {
  preview?: boolean;
}

function FormResponse({ preview }: FormResponseProps) {
  const { pollId } = useParams();

  if (typeof pollId !== "string" || !mongoObjectIdRegex.test(pollId)) {
    return <NotFoundPage />;
  }

  return <Index pollId={pollId} preview={preview} />;
}

export default FormResponse;
