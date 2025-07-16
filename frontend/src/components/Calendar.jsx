import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Calendar({ jobs }) {
  const navigate = useNavigate();

  const events = jobs.flatMap((job) => {
    const applicationDate = new Date(job.applicationDate);
    const deadlineDate = job.deadlineDate ? new Date(job.deadlineDate) : null;
    const interviews = job.interviews || [];

    const formattedJob = {
      ...job,
      applicationDate: !isNaN(applicationDate) ? applicationDate.toLocaleDateString() : "N/A",
      deadlineDate: deadlineDate && !isNaN(deadlineDate) ? deadlineDate.toLocaleDateString() : null,
      interviewDate: null,
    };
    const events = [];

    if (!isNaN(applicationDate)) {
      events.push({
        title: `${job.companyName} - ${job.role} (Application)`,
        date: applicationDate.toISOString().split("T")[0],
        color: "#6b46c1",
        extendedProps: { type: "Application", job: formattedJob },
      });
    }
    if (deadlineDate && !isNaN(deadlineDate)) {
      events.push({
        title: `${job.companyName} - ${job.role} (Deadline)`,
        date: deadlineDate.toISOString().split("T")[0],
        color: "#e53e3e",
        extendedProps: { type: "Deadline", job: formattedJob},
      });
    }

    interviews.forEach((int) => {
      const interviewDate = new Date(int.interviewDate);
      if (!isNaN(interviewDate)) {
        events.push({
          title: `${job.companyName} - ${int.round} Interview`,
          date: interviewDate.toISOString().split("T")[0],
          color: "#38a169",
          extendedProps: {
            type: `${int.round} Interview`,
            job: {
              ...formattedJob,
              interviewDate: interviewDate.toLocaleDateString(),
            },
          },
        });
      }
    });
    return events;
  });


  return (
    <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-lg mb-4">
      
      <h2 className="text-base md:text-lg font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-base" /> Calendar
      </h2>

      <div
        className={` lg:h-[550px] overflow-y-auto custom-calendar-scrollbar ${ 
          events.length === 0 ? "h-auto" : "min-h-[200px]"
        }`}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={(info) => {
            const jobId = info.event.extendedProps.job._id;
            if (jobId) {
              navigate(`/jobs/details/${jobId}`);
            }
          }}

          eventDidMount={(info) => {
            const job = info.event.extendedProps.job;

            tippy(info.el, {
              content: `
                <div class="p-3 bg-[var(--home)] text-[var(--primary)]/70 text-sm rounded-lg shadow-lg max-w-xs">
                  <div class="font-semibold">${job.companyName} - ${job.role}
                </div>
                  <div>Type: ${info.event.extendedProps.type}</div>
                  <div>Status: ${job.status}</div>
                  <div>Application: ${job.applicationDate}</div>
                  ${ job.deadlineDate ? `<div>Deadline: ${job.deadlineDate}</div>` : "" }
                  ${ job.interviewDate ? `<div>Interview: ${job.interviewDate}</div>` : "" }
                </div>
              `,
              allowHTML: true,
              theme: "light-border",
              placement: "top",
              animation: "shift-away",
              duration: 200,
            });
          }}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today",
          }}
          eventDisplay="block"
          eventTextColor="#ffffff"
          eventClassNames="text-sm truncate cursor-pointer"
          titleFormat={{ year: "numeric", month: "long" }}
          buttonText={{ today: "Today", prev: "<", next: ">" }}
          height="auto"
          contentHeight="auto"
        />
      </div>
    </div>
  );
}