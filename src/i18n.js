import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'me',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    me: {
      translation: {
        navigation: {
          home: 'Početna',
          addNew: 'Dodaj',
          addNewClient: 'Novog klijenta',
          addNewCar: 'Novo vozilo',
          addNewReservation: 'Novu rezervaciju',
          clients: 'Klijenti',
          vehicles: 'Vozila',
          reservations: 'Rezervacije',
        },
        modals: {
          newCar: 'Dodajte novo vozilo',
          newClient: 'Dodajte novog klijenta',
          newReservation: 'Dodajte novu rezervaciju',
        },
        buttons: {
          newCar: 'Dodaj vozilo',
          newClient: 'Dodaj klijenta',
          newReservation: 'Dodaj rezervaciju',
        },
      },
    },
    en: {
      translation: {
        navigation: {
          home: 'Home',
          addNew: 'Add new',
          addNewClient: 'Client',
          addNewCar: 'Vehicle',
          addNewReservation: 'Reservation',
          clients: 'Clients',
          vehicles: 'Vehicles',
          reservations: 'Reservations',
        },
        modals: {
          newCar: 'Add a new vehicle',
          newClient: 'Add a new client',
          newReservation: 'Add a new reservation',
        },
        buttons: {
          newCar: 'Add vehicle',
          newClient: 'Add client',
          newReservation: 'Add reservation',
        },
      },
    },
  },
});

export default i18n;
