export const testData = {
  title: 'Een compliment geven',
  overview: {
    sub_title: 'We stellen het erg op prijs dat je een compliment wilt geven',
    send_to: [
      {
        name: 'Gem. Eindhoven',
        access_level: 'Lezen en schrijven',
      },
    ],
    needed_documents: ['Eventueel een foto of document ter illustratie'],
    steps: [
      'Je geeft aan of je anoniem wilt blijven',
      'Je geeft aan wie of wat je een compliment wilt geven',
      'Je omschrijft het compliment',
      'Je voegt eventueel een foto of document to',
    ],
  },
  cost: false,
  start: '1',
  questions: [
    {
      id: '1',
      type: 'choice',
      title: 'Wil je je compliment anoniem indienen?',
      subtitle: 'We kunnen geen terugkoppeling geven als je anoniem indient',
      options: [
        {
          text: 'ja',
          goto: '2',
        },
        {
          text: 'nee',
          goto: '2',
        },
      ],
    },
    {
      id: '2',
      type: 'text',
      optional: {
        goto: '3',
      },
      title: 'Aan wie of wat wil je een compliment geven?',
      subtitle:
        'Als je geen naam weet, beschrijf dan zo goed mogelijk de functie van de persoon of het organisatie-onderdeel aan wie je een compliment wilt geven',
      data_properties: {
        title: 'Ontvanger van compliment',
        bind: 'receiver_compliment',
      },
      next: '3',
    },
    {
      id: '3',
      type: 'text',
      optional: {
        goto: '4',
      },
      title: 'Waarom wil je het compliment geven?',
      subtitle: 'Beschrijf wat de reden is dat jij het compliment wilt geven',
      data_properties: {
        title: 'Reden compliment',
        bind: 'compliment_reason',
      },
      next: '4',
    },
    {
      id: '4',
      type: 'choice',
      title: 'Wil je extra informatie over het compliment toevoegen?',
      subtitle: 'Je kunt een foto of een document toevoegen\t',
      options: [
        {
          text: 'Ik wil een document uploaden',
          icon: 'upload.svg',
          goto: 'bbe914c4-2e82-11e8-b467-0ed5f89f718b',
        },
        {
          text: 'Ik wil een foto maken',
          icon: 'camera.svg',
          goto: 'bbe912b2-2e82-11e8-b467-0ed5f89f718b',
        },
        {
          text: 'Nee',
          icon: '',
          goto: '7',
        },
      ],
    },
    {
      id: 'bbe914c4-2e82-11e8-b467-0ed5f89f718b',
      type: 'documents_upload',
      optional: {
        goto: '4',
      },
      title: 'Document aanleveren voor het compliment',
      subtitle: '',
      data_properties: {
        title: 'Documenten',
        bind: 'compliment_documents',
        placeholder: '',
      },
      another: {
        text: 'Nog een document toevoegen?',
        icon: 'upload.svg',
      },
      next: 'bbe90d9e-2e82-11e8-b467-0ed5f89f718b',
    },
    {
      id: 'bbe912b2-2e82-11e8-b467-0ed5f89f718b',
      type: 'documents_photo',
      optional: {
        goto: '4',
      },
      title: 'Foto maken voor bij het compliment',
      subtitle: '',
      data_properties: {
        title: 'Documenten',
        bind: 'compliment_documents',
        placeholder: '',
      },
      another: {
        text: 'Nog een foto maken?',
        icon: 'camera.svg',
      },
      next: 'bbe90d9e-2e82-11e8-b467-0ed5f89f718b',
    },
    {
      id: 'bbe90d9e-2e82-11e8-b467-0ed5f89f718b',
      type: 'radiobutton_group',
      title: 'Vind je het prettig als er contact wordt opgenomen met jou over het gegeven compliment?',
      subtitle: '',
      data_properties: {
        title: 'Contact',
        bind: 'contact',
      },
      options: [
        {
          text: 'Ja',
          value: 'Nee',
        },
        {
          text: 'Nee',
          value: 'Ja',
        },
      ],
    },
  ],
};
