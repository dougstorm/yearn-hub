import backgroundImageDark from '../../images/background_image_yearn_watch_dark.jpeg';
import backgroundImageLightNoMitch from '../../images/yearn_background_light_no_mitch.svg';
import backgroundLoading from '../../images/loadingBackground.svg';

export let lightTheme = {
    error: '#EB5757',
    backgroundImage: `url(${backgroundImageLightNoMitch})`,
    backgroundImageLoading: `url(${backgroundLoading})`,
    borderConfig: '#EB5757',
    backgroundConfig: 'rgba(255, 255, 255, 0.7)',
    iconTheme: '#212121',
    barProgress: '#EFD631',
    body: '#FFF',
    text: '#363537',
    title: '#333333',
    subtitle: '#828282',
    toggleBorder: '#FFF',
    background: '#363537',
    container: 'rgba(255, 255, 255, 0.7)',
    containerConfig: 'rgba(255, 255, 255, 0.7)',
    subContainer: 'rgba(255, 255, 255, 0.7)',
    border: '#e0e0e0',
    bodyBlue: '#0657F9',
};
export let darkTheme = {
    error: '#EB5757',
    borderConfig: 'transparent',
    backgroundConfig: '#006AE3',
    backgroundImage: `url(${backgroundImageDark})`,
    backgroundImageLoading: `url(${backgroundImageDark})`,
    iconTheme: '#FAFAFA',
    barProgress: '#006AE3',
    body: '#040e20',
    text: '#FAFAFA',
    title: '#FAFAFA',
    subtitle: 'rgba(255, 255, 255, 0.6)',
    toggleBorder: '#6B8096',
    background: '#999',
    container: '#0a1d3f',
    containerConfig: '#0552aa',
    subContainer: '#040e20',
    border: '#040e20',
    bodyBlue: '#006AE3',
};
