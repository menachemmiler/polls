const validationPollFromParam = (pollId: string | undefined): boolean => {
  const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  return !(!pollId || !mongoObjectIdRegex.test(pollId));
};

export default validationPollFromParam;
