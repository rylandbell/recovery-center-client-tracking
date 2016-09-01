const corr1 = {
  id: 1,
  clinician: {
    id: 13,
    firstName: 'Travis',
    lastName: 'Outlaw',
    flagged: false
  },
  client: {
    id: 109,
    firstName: 'George',
    lastName: 'Washington',
    currentLevelOfCare: 'IOP',
    flagged: false
  },
  messages: [
    {
      sender: 'clinician',
      timeSent: '2016-05-16T17:45:40.276Z',
      content: ' One day in a research meeting, in the spring of 1985, he and another postdoc, Leonard Martin, heard a presentation on the topic. Lots of studies found that if you asked someone to smile, she’d say she felt more happy or amused, and her body would react in kind. It appeared to be a small but reliable effect.'
    },
    {
      sender: 'client',
      timeSent: '2016-06-16T17:45:40.276Z',
      content: 'He told a group of students that he wanted to record the activity of their facial muscles under various conditions, and then he hooked silver cup electrodes to the corners of their mouths, the edges of their jaws, and the space between their eyebrows. The wires from the electrodes plugged into a set of fancy but nonfunctional gizmos.'
    },
    {
      sender: 'clinician',
      timeSent: '2016-07-16T17:45:40.276Z',
      content: 'This is the kind of thing I would only ever tell George Washington.'
    }
  ]
};

const corr2 = {
  id: 12,
  clinician: {
    id: 13,
    firstName: 'Travis',
    lastName: 'Outlaw',
    flagged: true
  },
  client: {
    id: 109,
    firstName: 'John',
    lastName: 'Adams',
    currentLevelOfCare: 'RTC',
    flagged: false
  },
  messages: [
    {
      sender: 'clinician',
      timeSent: '2016-05-16T17:45:40.276Z',
      content: ' One day in a research meeting, in the spring of 1985, he and another postdoc, Leonard Martin, heard a presentation on the topic. Lots of studies found that if you asked someone to smile, she’d say she felt more happy or amused, and her body would react in kind. It appeared to be a small but reliable effect.'
    },
    {
      sender: 'client',
      timeSent: '2016-06-16T17:45:40.276Z',
      content: 'He told a group of students that he wanted to record the activity of their facial muscles under various conditions, and then he hooked silver cup electrodes to the corners of their mouths, the edges of their jaws, and the space between their eyebrows. The wires from the electrodes plugged into a set of fancy but nonfunctional gizmos.'
    },
    {
      sender: 'clinician',
      timeSent: '2016-07-16T17:45:40.276Z',
      content: 'This is the kind of thing I would only ever tell John Adams.'
    }
  ]
};

module.exports = [corr1, corr2];

// Message: {
//   sender: 'clinician' or ‘client’
//   content: 'Dear Diary,...',
//   timeSent: ‘2016-08-30T12:00:00Z’
// }

// Correspondence: {
//   correspondenceId: 1,
//   clinician: {
//     id: 13
//     firstName: ‘’,
//     lastName: ‘’,
//     flagged: true
//   },
//   client: {
//     id: 109,
//     firstName: ‘’,
//     lastName: ‘’,
//     flagged: false,
//     currentLevelOfCare: ‘IOP’
//   },
//   messages: [array of Message objects]
// }
