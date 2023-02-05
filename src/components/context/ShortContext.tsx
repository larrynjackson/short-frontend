import React from 'react';

export type TagOptionType = {
  value: string;
  label: string;
};

export interface IShortContext {
  destMap: any;
  setDestMap: React.Dispatch<React.SetStateAction<any>>;
  tagMap: any;
  setTagMap: React.Dispatch<React.SetStateAction<any>>;
  tagArray: TagOptionType[] | undefined;
  setTagArray: React.Dispatch<
    React.SetStateAction<TagOptionType[] | undefined>
  >;
  tag: TagOptionType | undefined;
  setTag: React.Dispatch<React.SetStateAction<TagOptionType | undefined>>;
}

const ShortContext = React.createContext<IShortContext>({} as IShortContext);
export default ShortContext;
