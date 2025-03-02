import { format, parseISO } from "date-fns";

export const getFullYear = () => new Date().getFullYear();

export const formatDate = (date: string, formatString = "LLLL do, yyyy") =>
  format(parseISO(date), formatString);
