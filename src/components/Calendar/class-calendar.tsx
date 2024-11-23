
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

const events = [
	{
		title: 'My event',
		start: new Date(),
		end: new Date(moment().add(1, 'days').toDate()),
	},
]
let formats = {
	timeGutterFormat: 'HH:mm',
  }
  
const ClassCalendar = (props) => (
	<div>
		<Calendar
			localizer={localizer}
			events={events}
			startAccessor="start"
			endAccessor="end"
			style={{ height: 500 }}
			formats={formats}

		/>
	</div>
)

export default ClassCalendar;
