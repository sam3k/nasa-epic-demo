import {observable, runInAction} from 'mobx';
import moment from 'moment';
import { getClosestToDate } from '../utils/generic';

interface ImageMeta {
  caption: string;
  date: string;
  imgUrl: string;
}

interface IAlert {
  type: string;
  message: string;
}

export interface IEpicStore {
  error: string;
  alert: IAlert | null;
  loading: boolean;
  currentImage: ImageMeta;
  availableImages: string[];
  loadAvailableDates: () => Promise<any>;
  fetchImage: (date: Date) => Promise<void>;
}

export default class EpicStore implements IEpicStore {

  private apiKey = '5B6oJsSCQyekXZvNOKpsUhRPl1e7FHqjIAyHpybk';

  @observable
  public loading:boolean = false;

  @observable
  public error:string = '';

  @observable
  public alert:IAlert | null = null;

  @observable
  public currentImage:ImageMeta = {
    caption: '',
    date: '',
    imgUrl: '',
  };

  @observable
  public availableImages:string[] = [];

  public async loadAvailableDates() {
    try {
      const res = await fetch('https://epic.gsfc.nasa.gov/api/natural/available');
      const data = await res.json();
      
      if (data.length > 0) {
        this.availableImages = data;
      } else {
        this.error = 'NASA Epic Service is not available at the moment';
      }
    } catch (e) {
      this.error = e;
    }
  }

  public async fetchImage(date: Date) {
    this.loading = true;

    const errorMsg = 'We could not find an image of earth for this date.';
    const closestDate = getClosestToDate(this.availableImages.slice(), date);
    const dateFormatted = moment(closestDate).format('YYYY-MM-DD');
    const url = `https://api.nasa.gov/EPIC/api/natural/date/${dateFormatted}?api_key=${this.apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const dateImageFormat = moment(closestDate).format('YYYY/MM/DD');

      if (data.length > 0) {
        this.currentImage = {
          caption: data[0].caption,
          date: dateFormatted,
          imgUrl: `https://epic.gsfc.nasa.gov/archive/natural/${dateImageFormat}/png/${data[0].image}.png`
        };
      }

      if (moment(date).format('YYYY-MM-DD') !== closestDate) { 
        this.alert = {
          type: 'warn',
          message: `We could not find an image of earth for this date. But found one for ${dateImageFormat}`,
        }
      } else {
        this.error = '';
        this.alert = {
          type: 'success',
          message: `Happy bEarthDay!! (${moment(date).format('YYYY-MM-DD')})`,
        }
      }

      this.loading = false;
    } catch (e) {
      runInAction(() => this.error = errorMsg);
    }
  }
}