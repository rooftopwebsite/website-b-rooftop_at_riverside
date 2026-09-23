import type { LegalBlock } from '@/content/legal-docs';

export const GAMING_TRUCK_POLICIES: readonly LegalBlock[] = [
  {
    kind: 'parrafo',
    text: 'Booking any event with Rooftop at Riverside, LLC constitutes your agreement with these policies.',
  },

  { kind: 'titulo', text: 'Booking' },
  {
    kind: 'parrafo',
    text: 'A valid credit or debit card is required to pay for your Rooftop at Riverside, LLC experience. A $200 deposit is required to reserve your date and time and must be paid within 24 hours from the day of your invoice. The remaining balance must be paid in full no later than 5 days prior to the scheduled event date. If our schedule allows, any event booked within 10 days of the event date must be paid in full. Rooftop at Riverside, LLC reserves the right to keep any date open if the invoice/initial deposit has not received within 24 hours from the date the invoice was sent.',
  },

  { kind: 'titulo', text: 'Refund / cancellation' },
  {
    kind: 'parrafo',
    text: 'There will be a $25 cancellation fee for all events canceled after initial deposit is received. There will be a $100 cancellation fee for all events canceled within 30 days of your reserved event date. NO REFUNDS will be issued for canceling events within 14 days of your scheduled event date. Rescheduling is always an option, and Rooftop at Riverside, LLC will make every effort to accommodate you at no extra charge.',
  },

  { kind: 'titulo', text: 'Privacy policy' },
  {
    kind: 'parrafo',
    text: 'Rooftop at Riverside, LLC is committed to protecting your privacy. We use the information we collect on the site to make bookings with Rooftop at Riverside, LLC as simple as possible and to enhance your overall experience. We do not sell, trade, or rent your personal information to others.',
  },

  { kind: 'titulo', text: 'Inclement weather' },
  {
    kind: 'parrafo',
    text: 'In the event of severe weather (strong wind, rain, etc...) that makes traveling to our location dangerous or could create an unsafe situation on Premises, we reserve the right to reschedule your event to guarantee the safety of you, your guests, our staff and equipment. If the threat of these storms threatens your event and you are aware in advance (pending or anticipated thunder storm, tropical storm, or hurricane) please contact us to begin the rescheduling process.',
  },

  { kind: 'titulo', text: 'Additional need-to-know information' },

  {
    kind: 'clausula',
    rotulo: 'Food / drinks',
    cuerpo: [
      'We do not allow any food, drink, candy, gum, smoking, vaping, drugs, alcohol etc., in the gaming trailer. Please have your guests consume them outside of the gaming trailer or plan your refreshments before or after your gaming time.',
    ],
  },
  {
    kind: 'clausula',
    rotulo: 'Alcohol / drugs',
    cuerpo: [
      'You may consume alcohol at your event; however, we may require an on-site security surcharge and/or security deposit when alcohol is being served. We may reserve the right to refuse, cancel or terminate an ongoing event when alcohol is being served. Drugs of any sort will not be tolerated in or around the gaming trailer. Any observed use of illegal narcotics or legal narcotics used in an illegal manner will result in the termination of the event immediately and no refund will be issued.',
    ],
  },
  {
    kind: 'clausula',
    rotulo: 'Refusal of service',
    cuerpo: [
      'Rooftop at Riverside, LLC reserves the right to refuse service to clients or your guests if we observe behavior which we deem to be a potential threat to our staff, your guests, our guests, or our equipment/property. Such behavior includes, but is not limited to, obvious intoxication, observed or suspected illegal drug use or misuse or legal drugs, aggressive language or behavior, unsafe surroundings, etc. In this case, we may refuse to start an event or terminate an ongoing event and refuse refunds. Participants must adhere to Game Coach instructions at all times.',
    ],
  },
  {
    kind: 'clausula',
    rotulo: 'Behavior',
    cuerpo: [
      'Rooftop at Riverside, LLC reserves the right to expel you or your minor child(ren) from your booked event or from daily play without refund if you or your minor child(ren) to not adhere to our posted behavioral rules and regulations and/or ignore warnings from the on site game coach. There will be no cheating, no swearing, no damage, no harassment, no bullying, no violence, no fighting, and no behavior that would be unacceptable in a typical school setting.',
    ],
  },
  {
    kind: 'clausula',
    rotulo: 'Video game ratings',
    cuerpo: [
      'Rooftop at Riverside, LLC will not play any "M" rated or higher game in the gaming trailer without a written request from the client prior to the event or adult approval at the time of the event. If you wish to have an "M" rated game or higher at your event, please send an e-mail to indicating the game(s) we have in our inventory that you prefer. It is also recommended that all clients e-mail Rooftop at Riverside with your game requests before your event date so we have those games ready for your event.',
    ],
  },
  {
    kind: 'clausula',
    rotulo: 'Tipping',
    cuerpo: [
      'The Game Coach is there to make sure that your group is making the most of our high-tech fun. He or she tutors, inspires and entertains. Tipping for good service is a great idea, but not required.',
    ],
  },
];
