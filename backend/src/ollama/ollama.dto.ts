export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatRequestBody = {
  message: string;
  history?: ChatHistoryItem[];
};
