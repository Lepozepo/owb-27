import { format } from 'date-fns';

export default [
  {
    id: '1',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 1, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/179b6b1cb6755e31.svg' }],
    events: [
      {
        id: '1',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '2',
        from: 'walletId2',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
  {
    id: '2',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    events: [
      {
        id: '3',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '4',
        from: 'walletId3',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
  {
    id: '3',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    events: [
      {
        id: '3',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '4',
        from: 'walletId3',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
  {
    id: '4',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    events: [
      {
        id: '3',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '4',
        from: 'walletId3',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
  {
    id: '5',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    events: [
      {
        id: '3',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '4',
        from: 'walletId3',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
  {
    id: '6',
    title: 'Certificate of Achievement',
    description: 'For participating and completing on-flow course',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
    grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
    grantedBy: ['walletId2', 'walletId3'],
    ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    events: [
      {
        id: '3',
        createdBy: 'walletId2',
        change: 'CREATED',
      },
      {
        id: '4',
        from: 'walletId3',
        to: 'walletId1',
        change: 'TRANSFERRED',
      },
    ],
  },
];