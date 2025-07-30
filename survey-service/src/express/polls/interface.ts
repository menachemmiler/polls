export interface IPollSection {
  title: string;
  description?: string;
  questions: string[];
}

export interface PollSectionDocument extends IPollSection {
  _id: string;
}

export interface IPoll {
    name: string;
    title?: string;
    description?: string;
    isAnonymous?: boolean;
    createdBy: string;
    startAt?: Date;
    endAt?: Date;
    sections?: IPollSection[];
    design?: {
      header?: {
        fontSize?: number;
        fontFamily?: string;
      };
      questions?: {
        fontSize?: number;
        fontFamily?: string;
      };
      text?: {
        fontSize?: number;
        fontFamily?: string;
      };
      color?:string
      backgroundColor?:string
    };
}
  
export interface PollDocument extends IPoll {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
  