export interface Message {
  id: number;
  text: string;
  author: string;
}

export interface MessagePage {
  content: Message[];
  last: boolean;
  number: number;
}