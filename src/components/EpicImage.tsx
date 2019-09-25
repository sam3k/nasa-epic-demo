import React from 'react';

interface IProps {
  caption: string;
  image: string;
  date: string;
}

export const EpicImage = (props: IProps) => {
  return props.image !== '' ? (
    <div className="epic">
      <div className="epic-caption">{props.date}</div>
      <img src={props.image} className="epic-image" />
      <div className="epic-caption">{props.caption}</div>
    </div>
  ) : null;
}