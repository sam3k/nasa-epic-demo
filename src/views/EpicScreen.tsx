import React, { Component } from 'react';
import { DateInput, IDateFormatProps } from '@blueprintjs/datetime';
import { inject, observer } from 'mobx-react';
import { IEpicStore } from '../stores/epic';
import { EpicImage } from '../components/EpicImage';
import moment from 'moment';

interface IProps {
  epicStore?: IEpicStore;
}

interface IState {
  birthDate?: Date;
  selectedDate: Date | null;
}

@inject('epicStore')
@observer
export default class EpicScreen extends Component<IProps, IState> {
  public state:IState = {
    selectedDate: null,
  }

  private async fetchImageData(date:Date) {
    await this.props.epicStore!.fetchImage(date);
  }

  private async fetchAvailableDates() {
    await this.props.epicStore!.loadAvailableDates();
  }

  public componentDidMount() {
    this.fetchAvailableDates();
  }

  private onDateChange = (date: Date) => {
    const birthday = moment(date).set('year', 2019).toDate();

    if (date) {
      this.setState({selectedDate: date});
      this.fetchImageData(birthday);
    }
  }

  public render() {
    const { epicStore } = this.props;

    const jsDateFormatter: IDateFormatProps = {
      formatDate: date => date.toLocaleDateString(),
      parseDate: str => new Date(str),
      placeholder: "M/D/YYYY",
    }

    return (
      <div>

        {epicStore!.alert && (
          <div className={`alerts alert-${epicStore!.alert.type}`}>
            {epicStore!.alert.message}
          </div>
        )}

        <h1>Bearthday!</h1>

        <div className="tagline">
          Your birthday is so special NASA might have taken a photo of you on it!
        </div>

        <div className="blob">
          well okay, they took a photo of the earth... you might be in it... somewhere
        </div>

        <div className="instructions">
          Please enter your birthday and we'll find your bEarthday picture!
        </div>

        <div className="birthday-input">
          <DateInput 
            value={this.state.selectedDate}
            minDate={new Date('25 Dec 1940')}
            maxDate={new Date()}
            {...jsDateFormatter} 
            onChange={this.onDateChange}
          />
        </div>

        {epicStore!.loading && <div className="loading">Loading...</div>}

        <EpicImage
          date={epicStore!.currentImage!.date}
          image={epicStore!.currentImage!.imgUrl}
          caption={epicStore!.currentImage!.caption}
        />
      </div>
    );
  }
}