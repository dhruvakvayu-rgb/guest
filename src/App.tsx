import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { authenticate, type AuthRole } from "./auth"

type Page = "home" | "about" | "lectures" | "topic" | "availability" | "reviews" | "contact" | "login" | "register" | "workspace"

type BookingStatus = "Pending review" | "Approved" | "Completed" | "Declined" | "Reschedule requested"

type SlotStatus = "Available" | "Limited" | "Booked" | "Unavailable"

type Booking = {
  id: string

  institution: string

  contact: string

  email: string

  phone: string

  topic: string

  audience: string

  participants: number

  date: string

  time: string

  duration: string

  mode: string

  venue: string

  budget: string

  requirements: string

  status: BookingStatus

  lecturer: string

  createdAt: string
}

type Enquiry = {
  id: string
  name: string
  email: string
  organization: string
  subject: string
  message: string
  status: string
}

type Review = {
  id: string
  bookingId: string
  name: string
  institution: string
  topic: string
  rating: number
  text: string
  status: string
}

type Quote = {
  id: string
  bookingId: string
  amount: number
  paymentTerms: string
  createdAt: string
  status: "Draft"
}

type Topic = {
  id: string
  title: string
  category: string
  description: string
  duration: string
  format: string
}

const today = new Date()

const dateOffset = (days: number) => {
  const date = new Date(today)

  date.setDate(date.getDate() + days)

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const starterTopics: Topic[] = [
  {
    id: "ai",
    title: "AI & the Future of Work",
    category: "Technology",
    description:
      "Explore how artificial intelligence is reshaping industries, teams, and the skills that matter next.",
    duration: "60–90 min",
    format: "Keynote · Q&A",
  },

  {
    id: "leadership",
    title: "Leadership in a Changing World",
    category: "Leadership",
    description:
      "Practical ideas for building resilient, high-trust teams and leading through uncertainty.",
    duration: "60 min",
    format: "Talk · Workshop",
  },

  {
    id: "entrepreneurship",
    title: "From Idea to Impact",
    category: "Entrepreneurship",
    description:
      "A founder’s view of turning a bold idea into a sustainable, customer-led venture.",
    duration: "90 min",
    format: "Keynote · Q&A",
  },

  {
    id: "wellbeing",
    title: "Designing for Wellbeing",
    category: "Wellbeing",
    description:
      "Simple, evidence-informed ways to create healthier learning and working environments.",
    duration: "60 min",
    format: "Interactive session",
  },

  {
    id: "careers",
    title: "Building a Career with Intention",
    category: "Careers",
    description:
      "Navigate career transitions, communicate your strengths, and make your next move count.",
    duration: "45–60 min",
    format: "Talk · Q&A",
  },

  {
    id: "sustainability",
    title: "Innovation for a Sustainable Future",
    category: "Sustainability",
    description:
      "Discover the ideas and collaborations accelerating a more inclusive, sustainable future.",
    duration: "60–90 min",
    format: "Keynote · Panel",
  },
]

const initialBookings: Booking[] = [
  {
    id: "AG-2601",
    institution: "Northstar Institute of Technology",
    contact: "Ananya Rao",
    email: "ananya@northstar.edu",
    phone: "+91 98765 43210",
    topic: "AI & the Future of Work",
    audience: "Undergraduate students",
    participants: 120,
    date: dateOffset(5),
    time: "10:00 AM",
    duration: "60 minutes",
    mode: "Online",
    venue: "Video conference",
    budget: "₹25,000–₹50,000",
    requirements: "Please include a student Q&A.",
    status: "Pending review",
    lecturer: "Unassigned",
    createdAt: dateOffset(-2),
  },

  {
    id: "AG-2602",
    institution: "Cedar School of Business",
    contact: "Rohan Mehta",
    email: "rohan@cedar.edu",
    phone: "+91 99887 65432",
    topic: "Leadership in a Changing World",
    audience: "MBA cohort",
    participants: 80,
    date: dateOffset(8),
    time: "02:00 PM",
    duration: "90 minutes",
    mode: "Offline",
    venue: "Cedar Auditorium, Bengaluru",
    budget: "₹50,000–₹1,00,000",
    requirements: "Hybrid access for 15 remote learners.",
    status: "Approved",
    lecturer: "Dr. Kavya Nair",
    createdAt: dateOffset(-1),
  },

  {
    id: "AG-2597",
    institution: "Lakeside College",
    contact: "Nisha Kumar",
    email: "nisha@lakeside.edu",
    phone: "+91 98765 43211",
    topic: "Building a Career with Intention",
    audience: "Graduating students",
    participants: 65,
    date: dateOffset(-20),
    time: "11:00 AM",
    duration: "60 minutes",
    mode: "Offline",
    venue: "Lakeside College Auditorium",
    budget: "₹25,000–₹50,000",
    requirements: "Allow time for student questions.",
    status: "Completed",
    lecturer: "Dr. Kavya Nair",
    createdAt: dateOffset(-35),
  },
  {
    id: "AG-2598",
    institution: "Riverbend University",
    contact: "Mira Shah",
    email: "mira@riverbend.edu",
    phone: "+91 91234 56780",
    topic: "From Idea to Impact",
    audience: "Startup founders",
    participants: 45,
    date: dateOffset(-10),
    time: "11:00 AM",
    duration: "60 minutes",
    mode: "Online",
    venue: "Video conference",
    budget: "₹25,000–₹50,000",
    requirements: "Include a short founder case study.",
    status: "Completed",
    lecturer: "Arjun Iyer",
    createdAt: dateOffset(-22),
  },
]

const initialEnquiries: Enquiry[] = [
  {
    id: "EN-104",
    name: "Sanjay Pillai",
    email: "sanjay@westbridge.edu",
    organization: "Westbridge College",
    subject: "Leadership speaker for annual day",
    message:
      "We are planning an annual day in November and would love to discuss a leadership keynote for our graduating class.",
    status: "New",
  },

  {
    id: "EN-103",
    name: "Leena Das",
    email: "leena@brightpath.org",
    organization: "BrightPath Foundation",
    subject: "Workshop collaboration",
    message:
      "Could you share options for an interactive career-readiness session for our fellows?",
    status: "Contacted",
  },
]

const initialReviews: Review[] = [
  {
    id: "RV-23",
    bookingId: "AG-2598",
    name: "Mira Shah",
    institution: "Riverbend University",
    topic: "From Idea to Impact",
    rating: 5,
    text: "An open, practical conversation that gave our founders tools they could use the very next day.",
    status: "Published",
  },
]

const loadData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key)

    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

const loadDemoRecords = <T extends { id: string },>(
  key: string,
  seeds: T[],
): T[] => {
  const saved = loadData<T[]>(key, seeds)
  const existingIds = new Set(saved.map((record) => record.id))
  return [...saved, ...seeds.filter((record) => !existingIds.has(record.id))]
}

const displayDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

const bookingSteps = ["Your institution", "Session details", "Review request"]

const initialForm =
  (): Omit<Booking, "id" | "status" | "lecturer" | "createdAt"> => ({
    institution: "",
    contact: "",
    email: "",
    phone: "",
    topic: "",
    audience: "",
    participants: 30,

    date: "",
    time: "",
    duration: "60 minutes",
    mode: "Online",
    venue: "",
    budget: "Not sure yet",
    requirements: "",
  })

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),

    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),

    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),

    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),

    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,

    check: <path d="m5 12 4 4L19 6" />,

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),

    chevron: <path d="m9 18 6-6-6-6" />,

    back: (
      <>
        <path d="M19 12H5m7 7-7-7 7-7" />
      </>
    ),

    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    chart: (
      <>
        <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.1.1a8 8 0 0 1-1.8 1.1l-.2 1.9h-2.8l-.3-1.8a8 8 0 0 1-1.8-1.1l-1.7.7-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1.1l.3-1.9h2.8l.2 1.9a8 8 0 0 1 1.8 1.1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.check}
    </svg>
  )
}

function App() {
  const [page, setPage] = useState<Page>("home")

  const [role, setRole] = useState<AuthRole>("customer")

  const [dark, setDark] = useState(false)

  const [mobileMenu, setMobileMenu] = useState(false)

  const [topics, setTopics] = useState(() =>
    loadDemoRecords("ayuktha-topics", starterTopics),
  )
  const categories = useMemo(
    () => ["All topics", ...new Set(topics.map((topic) => topic.category))],
    [topics],
  )

  const [bookings, setBookings] = useState(() =>
    loadDemoRecords("ayuktha-bookings", initialBookings),
  )

  const [enquiries, setEnquiries] = useState(() =>
    loadData("ayuktha-enquiries", initialEnquiries),
  )

  const [reviews, setReviews] = useState(() => {
    const saved = loadDemoRecords("ayuktha-reviews", initialReviews)
    return saved.map((review) => {
      if (review.bookingId) return review
      const booking = bookings.find(
        (item) =>
          item.contact === review.name &&
          item.institution === review.institution &&
          item.topic === review.topic,
      )
      return booking ? { ...review, bookingId: booking.id } : review
    })
  })
  const [quotes, setQuotes] = useState(() =>
    loadData<Quote[]>("ayuktha-quotes", []),
  )

  const [notifications, setNotifications] = useState(() =>
    loadData<string[]>("ayuktha-notifications", [
      "Welcome to GuestConnect demo workspace.",
    ]),
  )

  const [availabilityOverrides, setAvailabilityOverrides] = useState(() =>
    loadData<Record<string, SlotStatus>>("ayuktha-availability", {}),
  )

  const [audit, setAudit] = useState(() =>
    loadData<string[]>("ayuktha-audit", [
      "Demo workspace created",
      "Sample bookings loaded",
    ]),
  )

  const [activeTopic, setActiveTopic] = useState<Topic>(starterTopics[0])

  const [search, setSearch] = useState("")

  const [category, setCategory] = useState("All topics")

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const [selectedDate, setSelectedDate] = useState("")

  const [bookingStep, setBookingStep] = useState(0)

  const [bookingForm, setBookingForm] = useState(initialForm)

  const [bookingError, setBookingError] = useState("")

  const [contactSent, setContactSent] = useState(false)

  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  const [adminTab, setAdminTab] = useState("Overview")

  const [customerTab, setCustomerTab] = useState("Bookings")

  const [authMessage, setAuthMessage] = useState("")
  const [authBusy, setAuthBusy] = useState(false)

  const [quoteBooking, setQuoteBooking] = useState<string | null>(null)

  const [reviewDraft, setReviewDraft] = useState({ rating: 5, text: "" })

  const [topicDraft, setTopicDraft] = useState({
    title: "",
    category: "",
    description: "",
  })

  const [calendarDraft, setCalendarDraft] = useState({
    date: dateOffset(1),
    status: "Unavailable" as SlotStatus,
  })

  useEffect(() => {
    localStorage.setItem("ayuktha-topics", JSON.stringify(topics))
  }, [topics])

  useEffect(() => {
    localStorage.setItem("ayuktha-bookings", JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem("ayuktha-enquiries", JSON.stringify(enquiries))
  }, [enquiries])

  useEffect(() => {
    localStorage.setItem("ayuktha-reviews", JSON.stringify(reviews))
  }, [reviews])
  useEffect(() => {
    localStorage.setItem("ayuktha-quotes", JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    localStorage.setItem("ayuktha-notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem(
      "ayuktha-availability",
      JSON.stringify(availabilityOverrides),
    )
  }, [availabilityOverrides])

  useEffect(() => {
    localStorage.setItem("ayuktha-audit", JSON.stringify(audit))
  }, [audit])

  const publishedReviews = reviews.filter(
    (review) => review.status === "Published",
  )
  const averageRating =
    publishedReviews.length > 0
      ? publishedReviews.reduce((sum, review) => sum + review.rating, 0) /
        publishedReviews.length
      : 0

  const visibleTopics = useMemo(
    () =>
      topics.filter(
        (topic) =>
          (category === "All topics" || topic.category === category) &&
          `${topic.title} ${topic.category} ${topic.description}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [topics, category, search],
  )
  const activeQuotes =
    quoteBooking && quoteBooking !== "payment-info"
      ? quotes.filter((quote) => quote.bookingId === quoteBooking)
      : []

  const navigate = (next: Page) => {
    setPage(next)

    setMobileMenu(false)

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const addNotice = (message: string) =>
    setNotifications((items) => [message, ...items].slice(0, 20))

  const logAction = (message: string) =>
    setAudit((items) =>
      [`${new Date().toLocaleString()} · ${message}`, ...items].slice(0, 40),
    )

  const createQuote = (
    bookingId: string,
    amount: number,
    paymentTerms: string,
  ) => {
    const quote: Quote = {
      id: `QT-${Date.now()}`,
      bookingId,
      amount,
      paymentTerms,
      createdAt: dateOffset(0),
      status: "Draft",
    }
    setQuotes((items) => [quote, ...items])
    addNotice(`A demo quotation was prepared for booking ${bookingId}.`)
    logAction(`Demo quotation ${quote.id} saved for booking ${bookingId}`)
  }

  const startBooking = (topic?: Topic) => {
    setBookingForm({
      ...initialForm(),
      topic: topic?.title ?? "",
      date: selectedDate || "",
    })

    setBookingStep(0)

    setBookingError("")

    navigate("workspace")

    setRole("customer")

    setCustomerTab("New booking")
  }

  const slotStatus = (date: string): SlotStatus => {
    if (date < dateOffset(0)) return "Unavailable"

    const reserved = bookings.filter(
      (booking) =>
        booking.date === date && !["Declined"].includes(booking.status),
    )

    if (reserved.length >= 3) return "Booked"

    const override = availabilityOverrides[date]
    if (override === "Booked" || override === "Unavailable") return override

    if (new Date(`${date}T12:00:00`).getDay() === 0 && !override) {
      return "Unavailable"
    }

    if (override === "Limited" || reserved.length > 0) return "Limited"

    if (override === "Available") return "Available"

    const day = Number(date.slice(-2))

    return day % 7 === 0 ? "Limited" : "Available"
  }

  const availableTimes = (date: string) => {
    const reserved = bookings
      .filter(
        (booking) =>
          booking.date === date && !["Declined"].includes(booking.status),
      )
      .map((booking) => booking.time)

    return ["10:00 AM", "02:00 PM", "04:00 PM"].filter(
      (time) => !reserved.includes(time),
    )
  }

  const setBookingField = (
    field: keyof ReturnType<typeof initialForm>,
    value: string | number,
  ) => setBookingForm((form) => ({ ...form, [field]: value }))

  const nextBookingStep = () => {
    setBookingError("")

    if (
      bookingStep === 0 &&
      (!bookingForm.institution.trim() ||
        !bookingForm.contact.trim() ||
        !bookingForm.email.includes("@") ||
        !bookingForm.phone.trim())
    ) {
      setBookingError(
        "Add your institution, contact name, a valid email address, and phone number to continue.",
      )

      return
    }

    if (bookingStep === 1) {
      if (
        !bookingForm.topic.trim() ||
        !bookingForm.audience.trim() ||
        (bookingForm.topic === "Custom topic" &&
          !bookingForm.requirements.trim()) ||
        !bookingForm.date ||
        !bookingForm.time ||
        !bookingForm.venue.trim()
      ) {
        setBookingError(
          "Complete the topic, audience, available date and time, and venue before continuing.",
        )

        return
      }

      if (
        slotStatus(bookingForm.date) === "Booked" ||
        slotStatus(bookingForm.date) === "Unavailable" ||
        !availableTimes(bookingForm.date).includes(bookingForm.time)
      ) {
        setBookingError(
          "That time is no longer available. Choose another available date and time.",
        )

        return
      }
    }

    setBookingStep((step) => Math.min(step + 1, 2))
  }

  const submitBooking = () => {
    if (
      bookings.some(
        (booking) =>
          booking.date === bookingForm.date &&
          booking.time === bookingForm.time &&
          booking.status !== "Declined",
      )
    ) {
      setBookingError("That slot was just taken. Please choose another time.")

      setBookingStep(1)

      return
    }

    const booking: Booking = {
      ...bookingForm,
      id: `AG-${Math.floor(2600 + Math.random() * 3000)}`,
      status: "Pending review",
      lecturer: "Unassigned",
      createdAt: dateOffset(0),
    }

    setBookings((items) => [booking, ...items])

    addNotice(`Booking request ${booking.id} has been received for review.`)

    setBookingForm(initialForm())

    setBookingStep(0)

    setCustomerTab("Bookings")

    navigate("workspace")
  }

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const enquiry: Enquiry = {
      id: `EN-${Math.floor(100 + Math.random() * 900)}`,

      name: String(data.get("name")),
      email: String(data.get("email")),
      organization: String(data.get("organization")),

      subject: String(data.get("subject")),
      message: String(data.get("message")),
      status: "New",
    }

    setEnquiries((items) => [enquiry, ...items])

    addNotice(`New enquiry received from ${enquiry.name}.`)

    setContactSent(true)

    event.currentTarget.reset()
  }

  const requestReschedule = (booking: Booking) => {
    setBookings((items) =>
      items.map((item) =>
        item.id === booking.id
          ? { ...item, status: "Reschedule requested" }
          : item,
      ),
    )

    addNotice(`Reschedule requested for ${booking.id}.`)
  }

  const changeBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    )

    addNotice(`Booking ${id} marked ${status.toLowerCase()}.`)

    logAction(`Booking ${id} updated to ${status}`)
  }

  const assignLecturer = (id: string, name: string) => {
    setBookings((items) =>
      items.map((item) =>
        item.id === id ? { ...item, lecturer: name } : item,
      ),
    )

    addNotice(`${name} assigned to booking ${id}.`)

    logAction(`${name} assigned to booking ${id}`)
  }

  const setCalendarStatus = (date: string, status: SlotStatus) => {
    setAvailabilityOverrides((items) => ({ ...items, [date]: status }))

    logAction(`Availability for ${date} changed to ${status}`)
  }

  const convertEnquiry = (enquiry: Enquiry) => {
    const request: Booking = {
      ...initialForm(),
      id: `AG-${Math.floor(2600 + Math.random() * 3000)}`,
      institution: enquiry.organization,

      contact: enquiry.name,
      email: enquiry.email,
      topic: enquiry.subject,
      audience: "To be confirmed",

      date: "",
      time: "",
      venue: "To be confirmed",
      status: "Pending review",
      lecturer: "Unassigned",
      createdAt: dateOffset(0),
    }

    setBookings((items) => [request, ...items])

    setEnquiries((items) =>
      items.map((item) =>
        item.id === enquiry.id
          ? { ...item, status: "Converted to booking" }
          : item,
      ),
    )

    addNotice(
      `Enquiry ${enquiry.id} converted to booking ${request.id}; confirm session details with the customer.`,
    )

    logAction(`Enquiry ${enquiry.id} converted to booking ${request.id}`)
  }

  const goToBooking = (topic?: Topic) => startBooking(topic)

  const renderTopicCard = (topic: Topic, index: number) => (
    <article
      key={topic.id}
      className="topic-card animate-in"
      style={{ animationDelay: `${index * 65}ms` }}
    >
      <div className="topic-art">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <Icon name="arrow" size={22} />
      </div>
      <div className="topic-card-body">
        <span className="eyebrow">{topic.category}</span>
        <h3>{topic.title}</h3>
        <p>{topic.description}</p>
        <div className="topic-meta">
          <span>
            <Icon name="clock" size={15} />
            {topic.duration}
          </span>
          <span>{topic.format}</span>
        </div>
        <div className="topic-actions">
          <button
            className="text-button"
            onClick={() => {
              setActiveTopic(topic)
              navigate("topic")
            }}
          >
            Explore topic <Icon name="arrow" size={16} />
          </button>
          <button
            aria-label={`Book ${topic.title}`}
            className="icon-button"
            onClick={() => goToBooking(topic)}
          >
            <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
    </article>
  )

  const publicNav: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About us", page: "about" },
    { label: "Guest lectures", page: "lectures" },

    { label: "Availability", page: "availability" },
    { label: "Reviews", page: "reviews" },
    { label: "Contact", page: "contact" },
  ]

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      {page !== "workspace" && (
        <header className="site-header">
          <div className="header-inner">
            <button
              className="wordmark"
              onClick={() => navigate("home")}
              aria-label="AYUKTHA GuestConnect home"
            >
              <img
                className="brand-logo brand-logo-header"
                src="/ayuktha-logo.jpg"
                alt="AYUKTHA"
              />
            </button>
            <nav
              className={`main-nav ${mobileMenu ? "open" : ""}`}
              aria-label="Main navigation"
            >
              {publicNav.map((item) => (
                <button
                  key={item.page}
                  className={page === item.page ? "active" : ""}
                  onClick={() => navigate(item.page)}
                >
                  {item.label}
                </button>
              ))}
              <button className="mobile-theme" onClick={() => setDark(!dark)}>
                <Icon name={dark ? "sun" : "moon"} size={16} />{" "}
                {dark ? "Light theme" : "Dark theme"}
              </button>
              <button
                className="mobile-login"
                onClick={() => navigate("login")}
              >
                Sign in
              </button>
            </nav>
            <div className="header-actions">
              <button
                className="theme-toggle"
                aria-label="Toggle color theme"
                title={dark ? "Switch to light theme" : "Switch to dark theme"}
                onClick={() => setDark(!dark)}
              >
                <Icon name={dark ? "sun" : "moon"} size={17} />
              </button>
              <button className="sign-in" onClick={() => navigate("login")}>
                Sign in
              </button>
              <button
                className="button button-dark button-small"
                onClick={() => goToBooking()}
              >
                Request a lecture <Icon name="arrow" size={16} />
              </button>
            </div>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
            >
              <Icon name={mobileMenu ? "close" : "menu"} />
            </button>
          </div>
        </header>
      )}

      {page === "home" && (
        <>
          <main>
            <section className="hero-section">
              <div className="hero-noise" />
              <div className="hero-content">
                <div className="hero-copy">
                  <div className="hero-kicker">
                    <span className="pulse-dot" /> MEANINGFUL CONVERSATIONS
                    START HERE
                  </div>
                  <h1>
                    Ideas worth sharing.
                    <br />
                    <em>People worth hearing.</em>
                  </h1>
                  <p>
                    Bring fresh perspectives to your campus. Find a speaker,
                    shape a session, and make your next guest lecture one to
                    remember.
                  </p>
                  <div className="hero-actions">
                    <button
                      className="button button-accent"
                      onClick={() => goToBooking()}
                    >
                      Plan a guest lecture <Icon name="arrow" size={17} />
                    </button>
                    <button
                      className="button button-ghost"
                      onClick={() => navigate("lectures")}
                    >
                      Explore the topics
                    </button>
                  </div>
                  <div className="hero-trust">
                    <div className="avatar-stack">
                      <span>AK</span>
                      <span>RN</span>
                      <span>MI</span>
                      <span>+</span>
                    </div>
                    <div>
                      <strong>Curiosity, in good company.</strong>
                      <small>For classrooms, communities &amp; teams</small>
                    </div>
                  </div>
                </div>
                <div className="hero-visual">
                  <div className="hero-orbit orbit-one" />
                  <div className="hero-orbit orbit-two" />
                  <div className="hero-card-main">
                    <div className="card-kicker">
                      <span className="live-dot" /> UPCOMING CONVERSATION
                    </div>
                    <div className="hero-card-symbol">✳</div>
                    <p className="hero-card-category">
                      TECHNOLOGY · FUTURE OF WORK
                    </p>
                    <h2>
                      Curiosity is a<br />
                      competitive edge.
                    </h2>
                    <p className="hero-card-note">
                      A guest lecture on how we learn, lead, and build what’s
                      next.
                    </p>
                    <div className="hero-speaker">
                      <span className="speaker-avatar">K</span>
                      <span>
                        <strong>Dr. Kavya Nair</strong>
                        <small>Researcher &amp; speaker</small>
                      </span>
                      <span className="speaker-arrow">
                        <Icon name="arrow" size={17} />
                      </span>
                    </div>
                  </div>
                  <div className="floating-note note-top">
                    <span className="note-icon">
                      <Icon name="star" size={15} />
                    </span>
                    <span>
                      <strong>Thoughtfully curated</strong>
                      <small>Sessions that stay with you</small>
                    </span>
                  </div>
                  <div className="floating-note note-bottom">
                    <span className="note-number">01</span>
                    <span>
                      <strong>Your next great idea</strong>
                      <small>Could start with one talk.</small>
                    </span>
                  </div>
                  <div className="hero-asterisk">✳</div>
                </div>
                <div className="hero-bottom-note">
                  <span>GUEST LECTURES, MADE HUMAN</span>
                  <span>SCROLL TO EXPLORE ↓</span>
                </div>
              </div>
            </section>

            <section className="proof-strip">
              <div>
                <strong>One thoughtful conversation</strong>
                <span>can change how a room sees the future.</span>
              </div>
              <div className="proof-stat">
                <strong>6</strong>
                <span>ideas to explore</span>
              </div>
              <div className="proof-stat">
                <strong>3</strong>
                <span>ways to connect</span>
              </div>
              <div className="proof-stat">
                <strong>1</strong>
                <span>simple place to begin</span>
              </div>
            </section>

            <section className="section topic-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">A GOOD PLACE TO START</span>
                  <h2>
                    Big ideas. <em>Open minds.</em>
                  </h2>
                  <p>
                    Browse conversation starters, then shape a session that fits
                    your people.
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => navigate("lectures")}
                >
                  All topics <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="topic-grid">
                {topics.slice(0, 3).map(renderTopicCard)}
              </div>
            </section>

            <section className="feature-band">
              <div className="feature-copy">
                <span className="eyebrow">MADE FOR YOUR MOMENT</span>
                <h2>
                  Not another talk.
                  <br />
                  <em>A room that thinks differently.</em>
                </h2>
                <p>
                  We make it easier for institutions to find the right voice,
                  agree on the details, and bring a great conversation to
                  life—online, in person, or somewhere in between.
                </p>
                <button
                  className="button button-dark"
                  onClick={() => navigate("about")}
                >
                  How it works <Icon name="arrow" size={16} />
                </button>
              </div>
              <div className="feature-list">
                <div>
                  <span>01</span>
                  <div>
                    <strong>Find your spark</strong>
                    <p>
                      Explore topics, formats, and ideas that fit your audience.
                    </p>
                  </div>
                </div>
                <div>
                  <span>02</span>
                  <div>
                    <strong>Make it yours</strong>
                    <p>
                      Tell us what matters. We’ll shape the session with you.
                    </p>
                  </div>
                </div>
                <div>
                  <span>03</span>
                  <div>
                    <strong>Bring people together</strong>
                    <p>
                      Get the logistics sorted and make space for a real
                      exchange.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="section home-review">
              <div className="review-feature">
                <span className="eyebrow">SAMPLE REVIEW · DEMO CONTENT</span>
                <div className="stars">
                  {"★".repeat(publishedReviews[0]?.rating ?? 5)}
                </div>
                <blockquote>
                  “
                  {publishedReviews[0]?.text ??
                    "Thoughtful conversations, made possible."}
                  ”
                </blockquote>
                <div className="review-byline">
                  <span className="review-avatar">
                    {(publishedReviews[0]?.name ?? "GuestConnect")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <span>
                    <strong>
                      {publishedReviews[0]?.name ?? "GuestConnect community"}
                    </strong>
                    <small>
                      {publishedReviews[0]?.institution ?? "Our community"}
                    </small>
                  </span>
                </div>
              </div>
              <div className="review-side">
                <span className="review-quote-mark">“</span>
                <p>
                  {publishedReviews[0]?.text ??
                    "Thoughtful conversations, made possible."}
                </p>
                <small>
                  {publishedReviews[0]?.name ?? "GuestConnect community"} ·{" "}
                  {publishedReviews[0]?.institution ?? "Our community"}
                </small>
                <button
                  className="text-button"
                  onClick={() => navigate("reviews")}
                >
                  More stories <Icon name="arrow" size={16} />
                </button>
              </div>
            </section>

            <section className="section faq-section">
              <div className="faq-intro">
                <span className="eyebrow">THE PRACTICALS</span>
                <h2>
                  A few things
                  <br />
                  <em>you might wonder.</em>
                </h2>
                <p>
                  Still have a question? We’re happy to help you figure out the
                  details.
                </p>
                <button
                  className="text-button"
                  onClick={() => navigate("contact")}
                >
                  Talk to our team <Icon name="arrow" size={16} />
                </button>
              </div>
              <div className="faq-list">
                {[
                  [
                    "How far ahead should we book?",
                    "A few weeks is ideal so there’s time to find the right speaker and shape the session. Share your preferred dates and we’ll confirm what is possible.",
                  ],

                  [
                    "Can we request a topic that is not listed?",
                    "Absolutely. Choose “Custom topic” in the booking form and tell us what you have in mind. We’ll explore the best fit together.",
                  ],

                  [
                    "Do you offer online and hybrid sessions?",
                    "Yes. Sessions can be online, in person, or hybrid. Add your preferred format and venue details to your request.",
                  ],

                  [
                    "How do quotations and payments work?",
                    "The team shares a quotation after reviewing your request. Payment is not processed in this demo; a real payment gateway must be configured before any transaction can take place.",
                  ],
                ].map(([question, answer], index) => (
                  <button
                    key={question}
                    className={`faq-item ${
                      faqOpen === index ? "expanded" : ""
                    }`}
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  >
                    <span>
                      <strong>{question}</strong>
                      <span>{faqOpen === index ? "−" : "+"}</span>
                    </span>
                    {faqOpen === index && <p>{answer}</p>}
                  </button>
                ))}
              </div>
            </section>

            <section className="last-cta">
              <div>
                <span className="eyebrow">YOUR NEXT GREAT CONVERSATION</span>
                <h2>
                  Let’s make room
                  <br />
                  for a new idea.
                </h2>
              </div>
              <button
                className="button button-accent"
                onClick={() => goToBooking()}
              >
                Start a booking request <Icon name="arrow" size={17} />
              </button>
              <span className="cta-decoration">✳</span>
            </section>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "about" && (
        <>
          <main className="page-main">
            <PageIntro
              eyebrow="A LITTLE ABOUT US"
              title={
                <>
                  Curiosity brings
                  <br />
                  <em>us together.</em>
                </>
              }
              description="AYUKTHA GuestConnect makes it simpler to bring thoughtful guest speakers and meaningful ideas into the places where people learn and grow."
            />
            <section className="about-story">
              <div className="about-visual">
                <span className="visual-ring" />
                <span className="visual-spark">✳</span>
                <span className="visual-caption">
                  GOOD IDEAS
                  <br />
                  TRAVEL FAR
                </span>
              </div>
              <div>
                <span className="eyebrow">WHY GUESTCONNECT</span>
                <h2>
                  Knowledge moves
                  <br />
                  when people meet.
                </h2>
                <p>
                  One honest conversation can make a new field feel possible,
                  turn a question into a direction, or help a community see
                  familiar challenges in a new light.
                </p>
                <p>
                  GuestConnect helps educational institutions and organizations
                  turn that possibility into a well-planned, welcoming
                  session—from the first idea through the final follow-up.
                </p>
                <button
                  className="button button-dark"
                  onClick={() => navigate("contact")}
                >
                  Get to know us <Icon name="arrow" size={16} />
                </button>
              </div>
            </section>
            <div className="values-grid">
              {[
                [
                  "01",
                  "People before podiums",
                  "We believe the best sessions make room for questions, context, and genuine exchange.",
                ],
                [
                  "02",
                  "Thoughtful by design",
                  "Good logistics create space for a better conversation. We take care of the details with you.",
                ],
                [
                  "03",
                  "Open to possibility",
                  "A listed topic is just a starting point. We welcome custom ideas and unexpected connections.",
                ],
              ].map(([no, title, text]) => (
                <article className="value-card" key={no}>
                  <span>{no}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <section className="about-cta">
              <span className="eyebrow">READY WHEN YOU ARE</span>
              <h2>
                Let’s find the right voice
                <br />
                for your next big idea.
              </h2>
              <button
                className="button button-accent"
                onClick={() => goToBooking()}
              >
                Make a booking request <Icon name="arrow" size={16} />
              </button>
            </section>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "lectures" && (
        <>
          <main className="page-main">
            <PageIntro
              eyebrow="EXPLORE THE POSSIBILITIES"
              title={
                <>
                  A topic is just
                  <br />
                  <em>the beginning.</em>
                </>
              }
              description="Start with a spark, find a theme that resonates, or bring us an idea of your own. Every session can be shaped around your audience."
            />
            <div className="topic-toolbar">
              <label className="search-field">
                <Icon name="search" size={18} />
                <input
                  placeholder="Search topics or themes"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <kbd>⌘ K</kbd>
              </label>
              <div className="category-pills">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "selected" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="topic-grid topic-grid-full">
              {visibleTopics.length ? (
                visibleTopics.map(renderTopicCard)
              ) : (
                <div className="empty-state">
                  <span className="eyebrow">NO MATCHES YET</span>
                  <h3>Try a different search.</h3>
                  <p>Or share your own topic idea with us.</p>
                  <button className="text-button" onClick={() => goToBooking()}>
                    Request a custom topic <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="custom-topic-callout">
              <span className="callout-spark">✳</span>
              <div>
                <span className="eyebrow">YOUR IDEA BELONGS HERE</span>
                <h2>Looking for something else?</h2>
                <p>
                  Tell us about the question your community is asking. We’ll
                  find the right way to explore it.
                </p>
              </div>
              <button
                className="button button-dark"
                onClick={() => goToBooking()}
              >
                Suggest a topic <Icon name="arrow" size={16} />
              </button>
            </div>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "topic" && (
        <>
          <main className="page-main detail-page">
            <button
              className="text-button back-link"
              onClick={() => navigate("lectures")}
            >
              <Icon name="back" size={17} /> Back to topics
            </button>
            <div className="detail-art">
              <span className="eyebrow">
                {activeTopic.category} · GUEST LECTURE
              </span>
              <span className="detail-star">✳</span>
              <h1>{activeTopic.title}</h1>
            </div>
            <div className="detail-layout">
              <div>
                <span className="eyebrow">ABOUT THIS SESSION</span>
                <h2>
                  Start with a question.
                  <br />
                  <em>Leave with a new lens.</em>
                </h2>
                <p>{activeTopic.description}</p>
                <p>
                  We’ll work with you to tailor the conversation to your
                  audience, experience level, and the questions you want to
                  explore. Sessions can include time for discussion, activities,
                  or an audience Q&amp;A.
                </p>
                <div className="detail-facts">
                  <span>
                    <Icon name="clock" size={18} />
                    <strong>{activeTopic.duration}</strong>
                    <small>Typical length</small>
                  </span>
                  <span>
                    <Icon name="users" size={18} />
                    <strong>{activeTopic.format}</strong>
                    <small>Session format</small>
                  </span>
                  <span>
                    <Icon name="calendar" size={18} />
                    <strong>Flexible</strong>
                    <small>Online · in person · hybrid</small>
                  </span>
                </div>
              </div>
              <aside className="detail-book-card">
                <span className="eyebrow">MAKE IT YOURS</span>
                <h3>Bring this conversation to your community.</h3>
                <p>
                  Share your preferred date and audience. We’ll follow up about
                  speaker fit, availability, and a tailored quotation.
                </p>
                <button
                  className="button button-dark button-full"
                  onClick={() => goToBooking(activeTopic)}
                >
                  Request this lecture <Icon name="arrow" size={16} />
                </button>
                <button
                  className="text-button"
                  onClick={() => navigate("availability")}
                >
                  Check availability <Icon name="arrow" size={15} />
                </button>
              </aside>
            </div>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "availability" && (
        <>
          <main className="page-main">
            <PageIntro
              eyebrow="FIND A TIME THAT WORKS"
              title={
                <>
                  A good conversation
                  <br />
                  <em>starts with a date.</em>
                </>
              }
              description="Explore indicative dates and request a time that suits your community. Your booking is confirmed only after our team reviews it."
            />
            <div className="calendar-layout">
              <section className="calendar-panel">
                <div className="calendar-heading">
                  <div>
                    <span className="eyebrow">SPEAKER AVAILABILITY</span>
                    <h2>
                      {calendarMonth.toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                  </div>
                  <div className="calendar-arrows">
                    <button
                      aria-label="Previous month"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                    >
                      <Icon name="back" size={17} />
                    </button>
                    <button
                      aria-label="Next month"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                    >
                      <Icon name="arrow" size={17} />
                    </button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <span className="calendar-day-name" key={day}>
                        {day}
                      </span>
                    ),
                  )}
                  {Array.from(
                    { length: (calendarMonth.getDay() + 6) % 7 },
                    (_, index) => (
                      <span key={`blank-${index}`} />
                    ),
                  )}
                  {Array.from(
                    {
                      length: new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        0,
                      ).getDate(),
                    },
                    (_, index) => {
                      const date = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        index + 1,
                      )
                      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                      const status = slotStatus(key)
                      return (
                        <button
                          key={key}
                          disabled={
                            status === "Unavailable" || status === "Booked"
                          }
                          className={`calendar-date ${
                            selectedDate === key ? "selected" : ""
                          } status-${status.toLowerCase()}`}
                          onClick={() => setSelectedDate(key)}
                          aria-label={`${displayDate(key)}: ${status}`}
                        >
                          {index + 1}
                          <i />
                        </button>
                      )
                    },
                  )}
                </div>
                <div className="calendar-legend">
                  <span>
                    <i className="legend-available" />
                    Available
                  </span>
                  <span>
                    <i className="legend-limited" />
                    Limited
                  </span>
                  <span>
                    <i className="legend-booked" />
                    Booked
                  </span>
                  <span>
                    <i className="legend-unavailable" />
                    Unavailable
                  </span>
                </div>
                <p className="calendar-disclaimer">
                  Indicative availability only. A request is not a confirmed
                  booking.
                </p>
              </section>
              <aside className="date-detail-panel">
                <span className="eyebrow">YOUR PREFERRED DATE</span>
                {selectedDate ? (
                  <>
                    <h3>{displayDate(selectedDate)}</h3>
                    <div className="date-status">
                      <span
                        className={`status-dot ${slotStatus(selectedDate).toLowerCase()}`}
                      />
                      {slotStatus(selectedDate)} availability
                    </div>
                    {availableTimes(selectedDate).length ? (
                      <>
                        <p>Choose a time to include in your booking request:</p>
                        <div className="time-options">
                          {availableTimes(selectedDate).map((time) => (
                            <button
                              className={
                                bookingForm.date === selectedDate &&
                                bookingForm.time === time
                                  ? "selected"
                                  : ""
                              }
                              key={time}
                              onClick={() => {
                                setBookingForm((form) => ({
                                  ...form,
                                  date: selectedDate,
                                  time,
                                }))
                                setBookingError("")
                              }}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        <button
                          className="button button-dark button-full"
                          onClick={() => {
                            setBookingForm((form) => ({
                              ...form,
                              date: selectedDate,
                              time:
                                bookingForm.time &&
                                availableTimes(selectedDate).includes(
                                  bookingForm.time,
                                )
                                  ? bookingForm.time
                                  : availableTimes(selectedDate)[0],
                            }))
                            setBookingStep(0)
                            setCustomerTab("New booking")
                            navigate("workspace")
                          }}
                        >
                          Request this date <Icon name="arrow" size={16} />
                        </button>
                      </>
                    ) : (
                      <p>
                        No session times are available on this date. Please
                        choose another.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="date-empty">
                    <span className="date-empty-icon">
                      <Icon name="calendar" size={23} />
                    </span>
                    <h3>Pick a day on the calendar</h3>
                    <p>
                      See indicative availability and choose a preferred session
                      time.
                    </p>
                  </div>
                )}
                <div className="calendar-support">
                  <Icon name="shield" size={17} />
                  <span>
                    We’ll confirm your date after reviewing the request with the
                    speaker.
                  </span>
                </div>
              </aside>
            </div>
            <div className="calendar-custom">
              <span className="eyebrow">NEED A DIFFERENT DATE?</span>
              <p>
                Share a few options in your booking request. We’ll do our best
                to find a time that works.
              </p>
              <button className="text-button" onClick={() => goToBooking()}>
                Request another date <Icon name="arrow" size={16} />
              </button>
            </div>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "reviews" && (
        <>
          <main className="page-main">
            <PageIntro
              eyebrow="THE CONVERSATIONS THAT STAY"
              title={
                <>
                  A few words from
                  <br />
                  <em>the room.</em>
                </>
              }
              description="Every thoughtful exchange leaves something behind. Here’s what our community has shared after their sessions."
            />
            <div className="review-summary">
              <div className="review-summary-number">
                {averageRating.toFixed(1)}
                <span>/5</span>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <p>From {publishedReviews.length} community stories</p>
              </div>
              <span className="review-summary-note">
                Demo sample content
                <br />
                Verification requires a secure backend
              </span>
            </div>
            <div className="reviews-grid">
              {publishedReviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <blockquote>“{review.text}”</blockquote>
                  <div className="review-byline">
                    <span className="review-avatar">
                      {review.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span>
                      <strong>{review.name}</strong>
                      <small>{review.institution}</small>
                    </span>
                    <span className="review-check">
                      <Icon name="check" size={14} /> Demo sample
                    </span>
                  </div>
                  <span className="review-topic">{review.topic}</span>
                </article>
              ))}
            </div>
            <div className="review-verification">
              <Icon name="shield" size={21} />
              <div>
                <strong>
                  Reviews are limited to completed bookings in this demo.
                </strong>
                <p>
                  Real customer verification and review moderation require a
                  secure account backend.
                </p>
              </div>
              <button className="text-button" onClick={() => navigate("login")}>
                Sign in <Icon name="arrow" size={15} />
              </button>
            </div>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {page === "contact" && (
        <>
          <main className="page-main">
            <PageIntro
              eyebrow="WE’RE LISTENING"
              title={
                <>
                  Tell us what’s
                  <br />
                  <em>on your mind.</em>
                </>
              }
              description="A question, a custom idea, a little help with your plans—we’d love to hear from you."
            />
            <div className="contact-layout">
              <form className="contact-form" onSubmit={submitContact}>
                <span className="eyebrow">SEND A NOTE</span>
                <h2>Let’s start a conversation.</h2>
                {contactSent && (
                  <div className="success-message">
                    <Icon name="check" size={18} /> Your enquiry is in the demo
                    admin inbox. We’ll be in touch.
                  </div>
                )}
                <div className="form-grid">
                  <label>
                    Your name
                    <input name="name" required placeholder="e.g. Ananya Rao" />
                  </label>
                  <label>
                    Work or institution email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@institution.edu"
                    />
                  </label>
                  <label>
                    Institution or organization
                    <input
                      name="organization"
                      required
                      placeholder="Your organization"
                    />
                  </label>
                  <label>
                    What’s this about?
                    <select name="subject" required defaultValue="">
                      <option value="" disabled>
                        Choose a topic
                      </option>
                      <option>Planning a guest lecture</option>
                      <option>Custom topic or speaker</option>
                      <option>Quotation and payment</option>
                      <option>Something else</option>
                    </select>
                  </label>
                  <label className="field-full">
                    A little more detail
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Tell us what you are thinking about..."
                    />
                  </label>
                </div>
                <button className="button button-dark" type="submit">
                  Send your enquiry <Icon name="arrow" size={16} />
                </button>
                <p className="form-note">
                  Your enquiry is stored in this browser’s demo workspace—not
                  sent to a live service.
                </p>
              </form>
              <aside className="contact-aside">
                <span className="eyebrow">HERE TO HELP</span>
                <h3>Good things start with a note.</h3>
                <p>
                  Share your goals, your questions, or the rough outline of an
                  idea. Our team will help you find a thoughtful next step.
                </p>
                <div className="contact-detail">
                  <span>
                    <Icon name="clock" size={18} />
                  </span>
                  <div>
                    <strong>Response time</strong>
                    <small>We aim to reply within 2 working days.</small>
                  </div>
                </div>
                <div className="contact-detail">
                  <span>
                    <Icon name="calendar" size={18} />
                  </span>
                  <div>
                    <strong>Booking support</strong>
                    <small>From first idea through session follow-up.</small>
                  </div>
                </div>
                <div className="contact-aside-note">
                  “The right conversation can open a whole new direction.”
                </div>
              </aside>
            </div>
          </main>
          <Footer navigate={navigate} />
        </>
      )}

      {(page === "login" || page === "register") && (
        <main className="auth-page">
          <div className="auth-art">
            <img
              className="auth-brand-logo"
              src="/ayuktha-logo.jpg"
              alt="AYUKTHA"
            />
            <h1>
              Good ideas
              <br />
              <em>find their people.</em>
            </h1>
            <p>Keep the details together. Make space for the conversation.</p>
            <div className="auth-art-symbol">✳</div>
            <span className="auth-art-foot">GUEST LECTURES, MADE HUMAN</span>
          </div>
          <div className="auth-form-wrap">
            <button
              className="text-button back-link"
              onClick={() => navigate("home")}
            >
              <Icon name="back" size={16} /> Back to home
            </button>
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault()
                const data = new FormData(event.currentTarget)
                setAuthBusy(true)
                setAuthMessage("")
                void authenticate(page === "login" ? "login" : "register", {
                  email: String(data.get("email")),
                  password: String(data.get("password")),
                  ...(page === "register"
                    ? { name: String(data.get("name")) }
                    : {}),
                })
                  .then((result) => {
                    if (!result.authenticated || !result.role) {
                      setAuthMessage(
                        result.message ??
                          "Your account needs verification before signing in.",
                      )
                      return
                    }
                    setRole(result.role)
                    setAuthMessage(
                      `Signed in securely${
                        result.displayName ? ` as ${result.displayName}` : ""
                      }.`,
                    )
                    navigate("workspace")
                  })
                  .catch((error: unknown) => {
                    setAuthMessage(
                      error instanceof Error
                        ? error.message
                        : "Authentication could not be completed.",
                    )
                  })
                  .finally(() => setAuthBusy(false))
              }}
            >
              <span className="eyebrow">
                {page === "login"
                  ? "WELCOME BACK"
                  : "MAKE A LITTLE SPACE FOR IDEAS"}
              </span>
              <h2>
                {page === "login"
                  ? "Sign in to your workspace."
                  : "Create your workspace."}
              </h2>
              <p>
                {page === "login"
                  ? "Manage requests, dates, and the details that make a great session."
                  : "Bring your institution’s guest lecture plans together in one place."}
              </p>
              {page === "register" && (
                <label>
                  Your name
                  <input name="name" required placeholder="Your full name" />
                </label>
              )}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@institution.edu"
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  placeholder="At least 6 characters"
                />
              </label>
              <button
                className="button button-dark button-full"
                type="submit"
                disabled={authBusy}
              >
                {authBusy
                  ? "Connecting securely…"
                  : page === "login"
                    ? "Sign in"
                    : "Create account"}{" "}
                <Icon name="arrow" size={16} />
              </button>
              {authMessage && (
                <p className="auth-feedback" role="status">
                  {authMessage}
                </p>
              )}
              <p className="auth-switch">
                {page === "login"
                  ? "New to GuestConnect?"
                  : "Already have a workspace?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMessage("")
                    navigate(page === "login" ? "register" : "login")
                  }}
                >
                  {page === "login" ? "Create an account" : "Sign in"}
                </button>
              </p>
              <div className="demo-auth-note">
                <Icon name="shield" size={17} />
                <span>
                  <strong>Authentication backend required</strong>
                  <br />
                  Credentials are sent only to a configured HTTPS auth API.
                  Session cookies must be HttpOnly, Secure, and server-issued.
                </span>
              </div>
              <div className="auth-demo-actions">
                <span className="eyebrow">
                  LOCAL DEMO DATA ONLY · NOT AUTHENTICATED
                </span>
                <button
                  className="button button-outline button-full"
                  type="button"
                  onClick={() => {
                    setRole("customer")
                    setAuthMessage(
                      "Customer demo only. No account was authenticated.",
                    )
                    navigate("workspace")
                  }}
                >
                  Preview customer workspace
                </button>
                <button
                  className="button button-outline button-full"
                  type="button"
                  onClick={() => {
                    setRole("admin")
                    setAuthMessage(
                      "Admin demo only. No account was authenticated; do not use with real customer data.",
                    )
                    navigate("workspace")
                  }}
                >
                  Preview admin portal
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {page === "workspace" &&
        (role === "admin" ? (
          <AdminWorkspace
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            bookings={bookings}
            quotes={quotes}
            enquiries={enquiries}
            reviews={reviews}
            topics={topics}
            setTopics={setTopics}
            notifications={notifications}
            audit={audit}
            setCalendarStatus={setCalendarStatus}
            calendarDraft={calendarDraft}
            setCalendarDraft={setCalendarDraft}
            changeBookingStatus={changeBookingStatus}
            assignLecturer={assignLecturer}
            createQuote={createQuote}
            convertEnquiry={convertEnquiry}
            setEnquiries={setEnquiries}
            setReviews={setReviews}
            topicDraft={topicDraft}
            setTopicDraft={setTopicDraft}
            dark={dark}
            setDark={setDark}
            logAction={logAction}
          />
        ) : (
          <CustomerWorkspace
            topics={topics}
            bookings={bookings}
            quotes={quotes}
            reviews={reviews}
            notifications={notifications}
            dark={dark}
            setDark={setDark}
            customerTab={customerTab}
            setCustomerTab={setCustomerTab}
            navigate={navigate}
            goToBooking={goToBooking}
            bookingStep={bookingStep}
            setBookingStep={setBookingStep}
            bookingForm={bookingForm}
            setBookingField={setBookingField}
            bookingError={bookingError}
            nextBookingStep={nextBookingStep}
            submitBooking={submitBooking}
            slotStatus={slotStatus}
            availableTimes={availableTimes}
            requestReschedule={requestReschedule}
            setQuoteBooking={setQuoteBooking}
            reviewDraft={reviewDraft}
            setReviewDraft={setReviewDraft}
            setReviews={setReviews}
            addNotice={addNotice}
            authMessage={authMessage}
          />
        ))}

      {quoteBooking && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setQuoteBooking(null)
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
          >
            <button
              className="modal-close"
              aria-label="Close dialog"
              onClick={() => setQuoteBooking(null)}
            >
              <Icon name="close" />
            </button>
            <span className="eyebrow">PAYMENT &amp; QUOTATIONS</span>
            <h2 id="quote-title">
              {activeQuotes.length
                ? "Quotation details"
                : "Payment gateway not connected."}
            </h2>
            {activeQuotes.length > 0 && (
              <div className="quote-list">
                {activeQuotes.map((quote) => {
                  const booking = bookings.find(
                    (item) => item.id === quote.bookingId,
                  )
                  return (
                    <article className="quote-card" key={quote.id}>
                      <span className="eyebrow">
                        {quote.id} · {displayDate(quote.createdAt)} · DEMO DRAFT
                      </span>
                      <strong>
                        {booking?.topic ?? "Guest lecture"} · ₹
                        {quote.amount.toLocaleString("en-IN")}
                      </strong>
                      {booking && <small>{booking.institution}</small>}
                      <p>
                        {quote.paymentTerms || "Payment terms to be confirmed."}
                      </p>
                    </article>
                  )
                })}
              </div>
            )}
            <p>
              Real payments are unavailable in this demo. No payment has been
              taken or confirmed. An admin must configure a verified gateway and
              secure backend before you can pay by UPI, card, or net banking.
            </p>
            <div className="gateway-options">
              <span>UPI</span>
              <span>Cards</span>
              <span>Net banking</span>
              <span>Partial payment</span>
            </div>
            <div className="demo-auth-note">
              <Icon name="shield" size={18} />
              <span>
                Quotation details may be managed as demo data. A real invoice or
                payment receipt requires backend and tax configuration.
              </span>
            </div>
            <button
              className="button button-dark button-full"
              onClick={() => setQuoteBooking(null)}
            >
              Understood
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: ReactNode
  description: string
}) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <button
            className="wordmark footer-wordmark"
            onClick={() => navigate("home")}
          >
            <img
              className="brand-logo"
              src="/ayuktha-logo.jpg"
              alt="AYUKTHA"
            />
          </button>
          <p>
            Ideas worth sharing.
            <br />
            People worth hearing.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <span>EXPLORE</span>
            <button onClick={() => navigate("about")}>About us</button>
            <button onClick={() => navigate("lectures")}>Guest lectures</button>
            <button onClick={() => navigate("availability")}>
              Availability
            </button>
          </div>
          <div>
            <span>CONNECT</span>
            <button onClick={() => navigate("reviews")}>
              Community stories
            </button>
            <button onClick={() => navigate("contact")}>Contact</button>
            <button onClick={() => navigate("login")}>
              Customer workspace
            </button>
          </div>
        </div>
        <button
          className="button button-accent"
          onClick={() => navigate("contact")}
        >
          Start a conversation <Icon name="arrow" size={15} />
        </button>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} AYUKTHA GuestConnect · Demo experience
        </span>
        <span>Thoughtful conversations, made possible.</span>
      </div>
    </footer>
  )
}

function CustomerWorkspace(props: {
  topics: Topic[]
  bookings: Booking[]
  quotes: Quote[]
  reviews: Review[]
  notifications: string[]
  dark: boolean
  setDark: (value: boolean) => void
  customerTab: string
  setCustomerTab: (tab: string) => void
  navigate: (page: Page) => void
  goToBooking: (topic?: Topic) => void

  bookingStep: number
  setBookingStep: (step: number) => void
  bookingForm: ReturnType<typeof initialForm>
  setBookingField: (
    field: keyof ReturnType<typeof initialForm>,
    value: string | number,
  ) => void

  bookingError: string
  nextBookingStep: () => void
  submitBooking: () => void
  slotStatus: (date: string) => SlotStatus
  availableTimes: (date: string) => string[]

  requestReschedule: (booking: Booking) => void
  setQuoteBooking: (id: string | null) => void
  reviewDraft: { rating: number; text: string }
  setReviewDraft: (value: { rating: number; text: string }) => void

  setReviews: (updater: (items: Review[]) => Review[]) => void
  addNotice: (message: string) => void
  authMessage: string
}) {
  const {
    topics,
    bookings,
    quotes,
    reviews,
    notifications,
    dark,
    setDark,
    customerTab,
    setCustomerTab,
    navigate,
    goToBooking,
    bookingStep,
    setBookingStep,
    bookingForm,
    setBookingField,
    bookingError,
    nextBookingStep,
    submitBooking,
    slotStatus,
    availableTimes,
    requestReschedule,
    setQuoteBooking,
    reviewDraft,
    setReviewDraft,
    setReviews,
    addNotice,
    authMessage,
  } = props

  const tabs = [
    "Bookings",
    "New booking",
    "Enquiries",
    "Payments",
    "Notifications",
  ]

  const [reviewFor, setReviewFor] = useState("")

  const [enquiryDraft, setEnquiryDraft] = useState({ subject: "", message: "" })

  const [paymentMethod, setPaymentMethod] = useState("UPI")

  const updateForm =
    (field: keyof ReturnType<typeof initialForm>) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) =>
      setBookingField(
        field,
        field === "participants"
          ? Number(event.target.value)
          : event.target.value,
      )

  const customerBookings = bookings.filter(
    (booking) =>
      booking.email.toLowerCase().includes("northstar") ||
      booking.email.toLowerCase().includes("riverbend") ||
      booking.id.startsWith("AG-"),
  )

  const completed = customerBookings.filter(
    (booking) => booking.status === "Completed",
  )
  const reviewableBookings = completed.filter(
    (booking) => !reviews.some((review) => review.bookingId === booking.id),
  )

  const submitCustomerReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const booking = bookings.find((item) => item.id === reviewFor)
    if (
      !booking ||
      booking.status !== "Completed" ||
      reviews.some((review) => review.bookingId === booking.id)
    ) {
      return
    }

    setReviews((items) => [
      {
        id: `RV-${Math.floor(20 + Math.random() * 80)}`,
        name: booking.contact,
        institution: booking.institution,
        topic: booking.topic,
        rating: reviewDraft.rating,
        text: reviewDraft.text,
        bookingId: booking.id,
        status: "Pending review",
      },
      ...items,
    ])

    addNotice(`Thank you for reviewing your completed session ${booking.id}.`)

    setReviewFor("")

    setReviewDraft({ rating: 5, text: "" })
  }

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <button className="wordmark" onClick={() => navigate("home")}>
          <img
            className="brand-logo"
            src="/ayuktha-logo.jpg"
            alt="AYUKTHA"
          />
        </button>
        <div className="workspace-label">CUSTOMER WORKSPACE</div>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCustomerTab(tab)}
              className={customerTab === tab ? "active" : ""}
            >
              <Icon
                name={
                  tab === "Bookings"
                    ? "book"
                    : tab === "New booking"
                      ? "plus"
                      : tab === "Enquiries"
                        ? "mail"
                        : tab === "Payments"
                          ? "chart"
                          : "bell"
                }
                size={18}
              />
              {tab}
              {tab === "Notifications" && <span className="nav-count">●</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip">
            <span className="profile-avatar">GC</span>
            <span>
              <strong>Guest customer</strong>
              <small>Demo workspace</small>
            </span>
          </div>
          <button onClick={() => navigate("home")}>
            <Icon name="back" size={17} /> Return to website
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="eyebrow">CUSTOMER WORKSPACE</span>
            <h1>
              {customerTab === "New booking"
                ? "Plan a guest lecture"
                : customerTab}
            </h1>
          </div>
          <div>
            <span className="demo-pill">DEMO DATA</span>
            <button
              className="theme-toggle workspace-theme-toggle"
              type="button"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setDark(!dark)}
            >
              <Icon name={dark ? "sun" : "moon"} size={16} />
            </button>
            <button
              className="button button-dark button-small"
              onClick={() => setCustomerTab("New booking")}
            >
              <Icon name="plus" size={15} /> New request
            </button>
          </div>
        </header>
        {authMessage && (
          <div className="workspace-notice">
            <Icon name="shield" size={18} />
            {authMessage}
          </div>
        )}
        {customerTab === "Bookings" && (
          <>
            <div className="welcome-panel">
              <div>
                <span className="eyebrow">YOUR IDEAS, IN MOTION</span>
                <h2>Welcome to your workspace.</h2>
                <p>
                  Keep your lecture requests, dates, and next steps close at
                  hand.
                </p>
              </div>
              <div className="welcome-icon">✳</div>
            </div>
            <div className="metric-grid">
              <Metric
                label="All bookings"
                value={String(customerBookings.length)}
                icon="calendar"
              />
              <Metric
                label="Awaiting review"
                value={String(
                  customerBookings.filter(
                    (item) => item.status === "Pending review",
                  ).length,
                )}
                icon="clock"
              />
              <Metric
                label="Completed sessions"
                value={String(completed.length)}
                icon="check"
              />
            </div>
            <section className="data-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">YOUR REQUESTS</span>
                  <h2>Booking activity</h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => setCustomerTab("New booking")}
                >
                  New booking <Icon name="arrow" size={15} />
                </button>
              </div>
              <BookingTable
                bookings={customerBookings}
                onReschedule={requestReschedule}
                onQuote={setQuoteBooking}
                onStatus={() => setCustomerTab("Bookings")}
              />
            </section>
            <div className="dashboard-two-col">
              <section className="data-panel compact-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">AFTER THE SESSION</span>
                    <h2>Share your experience</h2>
                  </div>
                  <Icon name="star" />
                </div>
                {reviewableBookings.length > 0 && !reviewFor ? (
                  <>
                    <p>
                      Share feedback for a completed session. Reviews are sent
                      to the admin for moderation.
                    </p>
                    <button
                      className="button button-dark button-small"
                      onClick={() => setReviewFor(reviewableBookings[0].id)}
                    >
                      Write a review
                    </button>
                  </>
                ) : reviewFor ? (
                  <form
                    className="compact-form"
                    onSubmit={submitCustomerReview}
                  >
                    <label>
                      Your rating
                      <div className="rating-picker">
                        {[1, 2, 3, 4, 5].map((number) => (
                          <button
                            type="button"
                            key={number}
                            className={
                              number <= reviewDraft.rating ? "selected" : ""
                            }
                            onClick={() =>
                              setReviewDraft({ ...reviewDraft, rating: number })
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What made the session memorable?"
                      value={reviewDraft.text}
                      onChange={(event) =>
                        setReviewDraft({
                          ...reviewDraft,
                          text: event.target.value,
                        })
                      }
                    />
                    <button className="button button-dark button-small">
                      Submit for review
                    </button>
                  </form>
                ) : completed.length > 0 ? (
                  <p>
                    Feedback for your completed sessions has already been
                    submitted or is awaiting admin review.
                  </p>
                ) : (
                  <p>
                    Reviews unlock after a session is marked completed by the
                    admin.
                  </p>
                )}
              </section>
              <section className="data-panel compact-panel">
                <span className="eyebrow">NEED A HAND?</span>
                <h2>We’re here to help.</h2>
                <p>Questions about your request or a custom session idea?</p>
                <button
                  className="text-button"
                  onClick={() => navigate("contact")}
                >
                  Contact the team <Icon name="arrow" size={15} />
                </button>
              </section>
            </div>
          </>
        )}
        {customerTab === "New booking" && (
          <section className="data-panel booking-form-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">A FEW THOUGHTFUL DETAILS</span>
                <h2>Booking request</h2>
                <p>
                  Your request is saved for admin review; it is not confirmed
                  until approved.
                </p>
              </div>
              <span className="demo-pill">STEP {bookingStep + 1} OF 3</span>
            </div>
            <div className="demo-auth-note">
              <Icon name="shield" size={17} />
              <span>
                Demo only: this request is stored in this browser, not sent to a
                live service. Do not enter sensitive personal information.
              </span>
            </div>
            <div className="stepper">
              {bookingSteps.map((label, index) => (
                <div
                  key={label}
                  className={`${index <= bookingStep ? "complete" : ""} ${
                    index === bookingStep ? "current" : ""
                  }`}
                >
                  <span>
                    {index < bookingStep ? (
                      <Icon name="check" size={14} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <small>{label}</small>
                </div>
              ))}
            </div>
            {bookingError && (
              <div className="error-message">{bookingError}</div>
            )}
            <form onSubmit={(event) => event.preventDefault()}>
              {bookingStep === 0 && (
                <div className="form-grid booking-fields">
                  <label>
                    Institution name *
                    <input
                      value={bookingForm.institution}
                      onChange={updateForm("institution")}
                      placeholder="University, school, or organization"
                    />
                  </label>
                  <label>
                    Contact person *
                    <input
                      value={bookingForm.contact}
                      onChange={updateForm("contact")}
                      placeholder="Your full name"
                    />
                  </label>
                  <label>
                    Email address *
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={updateForm("email")}
                      placeholder="you@institution.edu"
                    />
                  </label>
                  <label>
                    Phone number *
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={updateForm("phone")}
                      placeholder="+91"
                    />
                  </label>
                </div>
              )}
              {bookingStep === 1 && (
                <div className="form-grid booking-fields">
                  <label>
                    Lecture topic *
                    <select
                      value={bookingForm.topic}
                      onChange={(event) =>
                        setBookingField("topic", event.target.value)
                      }
                    >
                      <option value="">Choose a topic</option>
                      {topics.map((topic) => (
                        <option key={topic.id}>{topic.title}</option>
                      ))}
                      <option>Custom topic</option>
                    </select>
                  </label>
                  {bookingForm.topic === "Custom topic" && (
                    <label>
                      Describe your custom topic *
                      <input
                        value={bookingForm.requirements}
                        onChange={updateForm("requirements")}
                        placeholder="What would you like to explore?"
                      />
                    </label>
                  )}
                  <label>
                    Audience *
                    <input
                      value={bookingForm.audience}
                      onChange={updateForm("audience")}
                      placeholder="e.g. Undergraduate students"
                    />
                  </label>
                  <label>
                    Expected participants *
                    <input
                      type="number"
                      min="1"
                      max="5000"
                      value={bookingForm.participants}
                      onChange={updateForm("participants")}
                    />
                  </label>
                  <label>
                    Preferred date *
                    <input
                      type="date"
                      min={dateOffset(0)}
                      value={bookingForm.date}
                      onChange={updateForm("date")}
                    />
                  </label>
                  <label>
                    Preferred time *
                    <select
                      value={bookingForm.time}
                      onChange={updateForm("time")}
                      disabled={
                        !bookingForm.date ||
                        ["Booked", "Unavailable"].includes(
                          slotStatus(bookingForm.date),
                        )
                      }
                    >
                      <option value="">Choose an available time</option>
                      {bookingForm.date &&
                        availableTimes(bookingForm.date).map((time) => (
                          <option key={time}>{time}</option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Session duration
                    <select
                      value={bookingForm.duration}
                      onChange={updateForm("duration")}
                    >
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                      <option>Half day</option>
                    </select>
                  </label>
                  <label>
                    Delivery mode
                    <select
                      value={bookingForm.mode}
                      onChange={updateForm("mode")}
                    >
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Hybrid</option>
                    </select>
                  </label>
                  <label className="field-full">
                    Venue / online platform *
                    <input
                      value={bookingForm.venue}
                      onChange={updateForm("venue")}
                      placeholder="Address, venue, or video platform"
                    />
                  </label>
                  <label>
                    Indicative budget
                    <select
                      value={bookingForm.budget}
                      onChange={updateForm("budget")}
                    >
                      <option>Not sure yet</option>
                      <option>Under ₹25,000</option>
                      <option>₹25,000–₹50,000</option>
                      <option>₹50,000–₹1,00,000</option>
                      <option>Above ₹1,00,000</option>
                    </select>
                  </label>
                  <label className="field-full">
                    Additional requirements
                    <textarea
                      rows={3}
                      value={bookingForm.requirements}
                      onChange={updateForm("requirements")}
                      placeholder="Accessibility, AV setup, Q&A, travel, or anything else we should know."
                    />
                  </label>
                </div>
              )}
              {bookingStep === 2 && (
                <div className="booking-review">
                  <div className="review-ready">
                    <span className="review-ready-icon">
                      <Icon name="check" size={22} />
                    </span>
                    <div>
                      <h3>Ready to share your idea?</h3>
                      <p>
                        Your request will be sent to the demo admin workspace
                        for review. It is not a confirmed booking.
                      </p>
                    </div>
                  </div>
                  <div className="review-details">
                    <ReviewDetail
                      label="Institution"
                      value={bookingForm.institution}
                    />
                    <ReviewDetail
                      label="Contact"
                      value={`${bookingForm.contact} · ${bookingForm.email}`}
                    />
                    <ReviewDetail
                      label="Session"
                      value={`${bookingForm.topic} · ${bookingForm.audience} · ${bookingForm.participants} participants`}
                    />
                    <ReviewDetail
                      label="When"
                      value={`${
                        bookingForm.date ? displayDate(bookingForm.date) : ""
                      } · ${bookingForm.time} · ${bookingForm.duration}`}
                    />
                    <ReviewDetail
                      label="Format"
                      value={`${bookingForm.mode} · ${bookingForm.venue}`}
                    />
                    <ReviewDetail label="Budget" value={bookingForm.budget} />
                  </div>
                  <div className="payment-caveat">
                    <Icon name="shield" size={18} /> No payment is collected at
                    this stage. The admin will review the request and configure
                    quotations separately.
                  </div>
                </div>
              )}
              <div className="form-footer">
                {bookingStep > 0 && (
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={() => setBookingStep(bookingStep - 1)}
                  >
                    <Icon name="back" size={16} /> Back
                  </button>
                )}
                {bookingStep < 2 ? (
                  <button
                    className="button button-dark"
                    type="button"
                    onClick={nextBookingStep}
                  >
                    Continue <Icon name="arrow" size={16} />
                  </button>
                ) : (
                  <button
                    className="button button-accent"
                    type="button"
                    onClick={submitBooking}
                  >
                    Send booking request <Icon name="arrow" size={16} />
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
        {customerTab === "Enquiries" && (
          <>
            <section className="workspace-empty data-panel">
              <span className="date-empty-icon">
                <Icon name="mail" size={23} />
              </span>
              <h2>Start a conversation.</h2>
              <p>
                Enquiries sent using the contact form appear in the admin inbox.
                Your personal enquiry history requires a secure customer account
                backend.
              </p>
              <button
                className="button button-dark"
                onClick={() => navigate("contact")}
              >
                Send an enquiry <Icon name="arrow" size={16} />
              </button>
            </section>
          </>
        )}
        {customerTab === "Payments" && (
          <>
            <section className="payment-workspace data-panel">
              <span className="eyebrow">PAYMENTS &amp; QUOTATIONS</span>
              <h2>Clear details before any transaction.</h2>
              <p>
                This demo does not connect to a payment provider. No charge,
                confirmation, invoice, or receipt will be generated. An admin
                can prepare quotation data, then connect a verified gateway and
                backend before collecting money.
              </p>
              <div className="payment-method-grid">
                {["UPI", "Cards", "Net banking", "Partial payments"].map(
                  (method) => (
                    <button
                      key={method}
                      className={paymentMethod === method ? "selected" : ""}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <Icon
                        name={
                          method === "UPI"
                            ? "plus"
                            : method === "Cards"
                              ? "shield"
                              : method === "Net banking"
                                ? "chart"
                                : "calendar"
                        }
                        size={19}
                      />
                      {method}
                    </button>
                  ),
                )}
              </div>
              <div className="payment-caveat">
                <Icon name="shield" size={18} /> {paymentMethod} is not
                available until gateway credentials and secure server-side
                verification are configured.
              </div>
              <div className="customer-quotes">
                <h3>Your quotation drafts</h3>
                {quotes.length === 0 ? (
                  <p>No quotations have been prepared for your requests yet.</p>
                ) : (
                  quotes.map((quote) => {
                    const booking = bookings.find(
                      (item) => item.id === quote.bookingId,
                    )
                    return (
                      <article className="customer-quote-row" key={quote.id}>
                        <div>
                          <strong>
                            {booking?.topic ?? "Guest lecture"} · ₹
                            {quote.amount.toLocaleString("en-IN")}
                          </strong>
                          <small>
                            {quote.bookingId} · {quote.status} · Prepared{" "}
                            {displayDate(quote.createdAt)}
                          </small>
                          {quote.paymentTerms && (
                            <small>{quote.paymentTerms}</small>
                          )}
                        </div>
                        <button
                          className="text-button"
                          onClick={() => setQuoteBooking(quote.bookingId)}
                        >
                          View quote <Icon name="arrow" size={15} />
                        </button>
                      </article>
                    )
                  })
                )}
              </div>
              <p className="form-note">
                There is no verified payment history yet. Demo quotations are
                not invoices or payment confirmations.
              </p>
              <button
                className="button button-outline"
                onClick={() => setQuoteBooking("payment-info")}
              >
                View payment setup details
              </button>
            </section>
          </>
        )}
        {customerTab === "Notifications" && (
          <section className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">LATEST UPDATES</span>
                <h2>Your notifications</h2>
              </div>
            </div>
            <div className="notification-list">
              {notifications.map((item, index) => (
                <div className="notification-row" key={`${index}-${item}`}>
                  <span>
                    <Icon name="bell" size={17} />
                  </span>
                  <div>
                    <p>{item}</p>
                    <small>GuestConnect demo workspace</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function ReviewDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value || "Not provided"}</strong>
    </div>
  )
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: string
}) {
  return (
    <article className="metric-card">
      <span className="metric-icon">
        <Icon name={icon} size={19} />
      </span>
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <small>Demo workspace</small>
    </article>
  )
}

function BookingTable({
  bookings,
  onReschedule,
  onQuote,
  onStatus,
}: {
  bookings: Booking[]
  onReschedule: (booking: Booking) => void
  onQuote: (id: string) => void
  onStatus: (id: string, status: BookingStatus) => void
}) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Request</th>
            <th>Lecture &amp; date</th>
            <th>Institution</th>
            <th>Status</th>
            <th>Next step</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <strong>{booking.id}</strong>
                <small>{booking.contact}</small>
              </td>
              <td>
                <strong>{booking.topic}</strong>
                <small>
                  {booking.date ? displayDate(booking.date) : "Date to confirm"}{" "}
                  · {booking.time || "Time TBD"}
                </small>
              </td>
              <td>
                {booking.institution}
                <small>
                  {booking.mode} · {booking.participants} participants
                </small>
              </td>
              <td>
                <span
                  className={`status-pill status-${booking.status.toLowerCase().replace(/ /g, "-")}`}
                >
                  {booking.status}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  {booking.status === "Completed" ? (
                    <button
                      className="text-button table-button"
                      onClick={() => onStatus(booking.id, "Completed")}
                    >
                      Details
                    </button>
                  ) : (
                    <button
                      className="text-button table-button"
                      onClick={() => onReschedule(booking)}
                    >
                      Reschedule
                    </button>
                  )}
                  <button
                    className="text-button table-button"
                    onClick={() => onQuote(booking.id)}
                  >
                    Quote / pay
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 && (
        <div className="empty-table">
          No requests yet. Your next great conversation can start here.
        </div>
      )}
    </div>
  )
}

function AdminWorkspace(props: {
  adminTab: string
  setAdminTab: (tab: string) => void
  bookings: Booking[]
  quotes: Quote[]
  enquiries: Enquiry[]
  reviews: Review[]
  topics: Topic[]
  setTopics: (updater: (items: Topic[]) => Topic[]) => void

  notifications: string[]
  audit: string[]
  setCalendarStatus: (date: string, status: SlotStatus) => void
  calendarDraft: { date: string; status: SlotStatus }
  setCalendarDraft: (value: { date: string; status: SlotStatus }) => void

  changeBookingStatus: (id: string, status: BookingStatus) => void
  createQuote: (bookingId: string, amount: number, paymentTerms: string) => void
  convertEnquiry: (enquiry: Enquiry) => void
  setEnquiries: (updater: (items: Enquiry[]) => Enquiry[]) => void

  setReviews: (updater: (items: Review[]) => Review[]) => void
  topicDraft: { title: string; category: string; description: string }
  setTopicDraft: (value: {
    title: string
    category: string
    description: string
  }) => void

  assignLecturer: (id: string, name: string) => void
  dark: boolean
  setDark: (value: boolean) => void
  logAction: (message: string) => void
}) {
  const {
    adminTab,
    setAdminTab,
    bookings,
    quotes,
    enquiries,
    reviews,
    topics,
    setTopics,
    notifications,
    audit,
    setCalendarStatus,
    calendarDraft,
    setCalendarDraft,
    changeBookingStatus,
    createQuote,
    assignLecturer,
    convertEnquiry,
    setEnquiries,
    setReviews,
    topicDraft,
    setTopicDraft,
    dark,
    setDark,
    logAction,
  } = props

  const [bookingFilter, setBookingFilter] = useState("All")

  const [search, setSearch] = useState("")

  const customers = useMemo(() => {
    const records = new Map<string, {
      name: string
      organization: string
      email: string
      bookings: number
    }>()

    bookings.forEach((booking) => {
      const email = booking.email.trim().toLowerCase()
      if (!email) return
      const existing = records.get(email)
      if (existing) {
        existing.bookings += 1
      } else {
        records.set(email, {
          name: booking.contact,
          organization: booking.institution,
          email,
          bookings: 1,
        })
      }
    })

    return Array.from(records.values())
  }, [bookings])

  const tabs = [
    "Overview",
    "Bookings",
    "Availability",
    "Lecture topics",
    "Enquiries",
    "Customers",
    "Lecturers",
    "Payments",
    "Reviews",
    "Reports",
    "Notifications",
    "Settings",
    "Audit log",
  ]

  const [lecturer, setLecturer] = useState("Dr. Kavya Nair")

  const [selectedBooking, setSelectedBooking] = useState("")

  const [quotationAmount, setQuotationAmount] = useState("")

  const [quoteMessage, setQuoteMessage] = useState("")

  const [newLecturer, setNewLecturer] = useState("")

  const [lecturers, setLecturers] = useState(["Dr. Kavya Nair", "Arjun Iyer"])

  const counts = {
    pending: bookings.filter((item) => item.status === "Pending review").length,
    approved: bookings.filter((item) => item.status === "Approved").length,
    complete: bookings.filter((item) => item.status === "Completed").length,
    newEnquiries: enquiries.filter((item) => item.status === "New").length,
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      (bookingFilter === "All" || booking.status === bookingFilter) &&
      `${booking.id} ${booking.institution} ${booking.topic} ${booking.contact}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  const bookingOptions = bookings.map((booking) => (
    <option key={booking.id} value={booking.id}>
      {booking.id} · {booking.institution}
    </option>
  ))

  const handleTopicSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const item: Topic = {
      ...topicDraft,
      id: `topic-${Date.now()}`,
      duration: "60 minutes",
      format: "Talk · Q&A",
    }

    setTopics((items) => [...items, item])

    setTopicDraft({ title: "", category: "", description: "" })

    logAction(`Topic ${item.title} created`)
  }

  return (
    <div className="workspace-shell admin-shell">
      <aside className="workspace-sidebar">
        <button className="wordmark" onClick={() => setAdminTab("Overview")}>
          <img
            className="brand-logo"
            src="/ayuktha-logo.jpg"
            alt="AYUKTHA"
          />
        </button>
        <div className="workspace-label">ADMIN PORTAL</div>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={adminTab === tab ? "active" : ""}
            >
              <Icon
                name={
                  tab === "Overview" || tab === "Reports"
                    ? "chart"
                    : tab === "Bookings"
                      ? "book"
                      : tab === "Availability"
                        ? "calendar"
                        : tab === "Lecture topics"
                          ? "star"
                          : tab === "Enquiries"
                            ? "mail"
                            : tab === "Customers" || tab === "Lecturers"
                              ? "users"
                              : tab === "Payments"
                                ? "shield"
                                : tab === "Reviews"
                                  ? "star"
                                  : tab === "Notifications"
                                    ? "bell"
                                    : tab === "Settings"
                                      ? "settings"
                                      : "clock"
                }
                size={18}
              />
              {tab}
              {tab === "Enquiries" && counts.newEnquiries > 0 && (
                <span className="nav-count">{counts.newEnquiries}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip">
            <span className="profile-avatar admin-avatar">AD</span>
            <span>
              <strong>GuestConnect admin</strong>
              <small>Demo administrator</small>
            </span>
          </div>
          <button
            onClick={() => {
              window.location.hash = ""
              window.location.reload()
            }}
          >
            <Icon name="back" size={17} /> Return to website
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>
            <h1>{adminTab}</h1>
          </div>
          <div>
            <span className="demo-pill">DEMO DATA · NO BACKEND</span>
            <button
              className="theme-toggle workspace-theme-toggle"
              type="button"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setDark(!dark)}
            >
              <Icon name={dark ? "sun" : "moon"} size={16} />
            </button>
            <span className="admin-avatar-mini">AD</span>
          </div>
        </header>
        {adminTab === "Overview" && (
          <>
            <div className="welcome-panel admin-welcome">
              <div>
                <span className="eyebrow">
                  THURSDAY,{" "}
                  {today
                    .toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </span>
                <h2>A good day to make things happen.</h2>
                <p>Here’s what’s moving in your GuestConnect workspace.</p>
              </div>
              <div className="welcome-icon">✳</div>
            </div>
            <div className="metric-grid admin-metrics">
              <Metric
                label="Booking requests"
                value={String(bookings.length)}
                icon="calendar"
              />
              <Metric
                label="Need your review"
                value={String(counts.pending)}
                icon="clock"
              />
              <Metric
                label="New enquiries"
                value={String(counts.newEnquiries)}
                icon="mail"
              />
              <Metric
                label="Completed sessions"
                value={String(counts.complete)}
                icon="check"
              />
            </div>
            <div className="dashboard-two-col">
              <section className="data-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">NEEDS ATTENTION</span>
                    <h2>Recent booking requests</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setAdminTab("Bookings")}
                  >
                    All bookings <Icon name="arrow" size={15} />
                  </button>
                </div>
                <div className="admin-booking-list">
                  {bookings.slice(0, 4).map((booking) => (
                    <div key={booking.id} className="admin-booking-row">
                      <span className="booking-row-icon">
                        <Icon name="calendar" size={17} />
                      </span>
                      <div>
                        <strong>{booking.institution}</strong>
                        <small>
                          {booking.topic} ·{" "}
                          {booking.date
                            ? displayDate(booking.date)
                            : "Date TBD"}
                        </small>
                      </div>
                      <span
                        className={`status-pill status-${booking.status.toLowerCase().replace(/ /g, "-")}`}
                      >
                        {booking.status}
                      </span>
                      {booking.status === "Pending review" && (
                        <button
                          className="icon-button"
                          aria-label={`Review ${booking.id}`}
                          onClick={() => setAdminTab("Bookings")}
                        >
                          <Icon name="chevron" size={17} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              <section className="data-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">ENQUIRY INBOX</span>
                    <h2>Latest conversations</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setAdminTab("Enquiries")}
                  >
                    Open inbox <Icon name="arrow" size={15} />
                  </button>
                </div>
                {enquiries.slice(0, 3).map((item) => (
                  <div className="enquiry-preview" key={item.id}>
                    <span className="enquiry-bullet" />
                    <div>
                      <strong>{item.subject}</strong>
                      <small>
                        {item.name} · {item.organization}
                      </small>
                    </div>
                  </div>
                ))}
              </section>
            </div>
            <div className="admin-demo-notice">
              <Icon name="shield" size={18} />
              <p>
                <strong>Prototype, not a live service.</strong> Admin actions
                and records persist only in this browser. Add secure backend
                storage, access control, and gateway credentials before handling
                real customer data or payments.
              </p>
            </div>
          </>
        )}
        {adminTab === "Bookings" && (
          <section className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">REQUEST PIPELINE</span>
                <h2>Manage bookings</h2>
                <p>
                  Review and update booking requests. Status changes are saved
                  in this browser.
                </p>
              </div>
              <button
                className="button button-outline button-small"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(bookings, null, 2)], {
                    type: "application/json",
                  })
                  const url = URL.createObjectURL(blob)
                  const anchor = document.createElement("a")
                  anchor.href = url
                  anchor.download = "guestconnect-demo-bookings.json"
                  anchor.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Export demo data
              </button>
            </div>
            <div className="admin-toolbar">
              <label className="search-field">
                <Icon name="search" size={17} />
                <input
                  placeholder="Search bookings"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <select
                value={bookingFilter}
                onChange={(event) => setBookingFilter(event.target.value)}
              >
                <option>All</option>
                {[
                  "Pending review",
                  "Approved",
                  "Completed",
                  "Declined",
                  "Reschedule requested",
                ].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="table-scroll">
              <table className="data-table admin-table">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Institution / contact</th>
                    <th>Session</th>
                    <th>Date / format</th>
                    <th>Status / actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.id}</strong>
                        <small>{displayDate(booking.createdAt)}</small>
                      </td>
                      <td>
                        <strong>{booking.institution}</strong>
                        <small>
                          {booking.contact} · {booking.email}
                        </small>
                      </td>
                      <td>
                        <strong>{booking.topic}</strong>
                        <small>
                          {booking.participants} participants ·{" "}
                          {booking.audience}
                        </small>
                      </td>
                      <td>
                        <strong>
                          {booking.date
                            ? displayDate(booking.date)
                            : "To be confirmed"}
                        </strong>
                        <small>
                          {booking.time || "Time TBD"} · {booking.mode}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-${booking.status.toLowerCase().replace(/ /g, "-")}`}
                        >
                          {booking.status}
                        </span>
                        <div className="table-actions admin-actions">
                          {booking.status === "Pending review" ||
                          booking.status === "Reschedule requested" ? (
                            <>
                              <button
                                className="mini-action approve"
                                onClick={() =>
                                  changeBookingStatus(booking.id, "Approved")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="mini-action decline"
                                onClick={() =>
                                  changeBookingStatus(booking.id, "Declined")
                                }
                              >
                                Decline
                              </button>
                            </>
                          ) : booking.status === "Approved" ? (
                            <button
                              className="mini-action approve"
                              onClick={() =>
                                changeBookingStatus(booking.id, "Completed")
                              }
                            >
                              Mark complete
                            </button>
                          ) : (
                            <button
                              className="mini-action"
                              onClick={() =>
                                changeBookingStatus(
                                  booking.id,
                                  "Pending review",
                                )
                              }
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {adminTab === "Availability" && (
          <div className="admin-module-grid">
            <section className="data-panel">
              <span className="eyebrow">SCHEDULE CONTROL</span>
              <h2>Manage availability</h2>
              <p>
                Set a date as available, limited, booked, or unavailable.
                Existing booking requests still need admin review.
              </p>
              <form
                className="availability-admin-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setCalendarStatus(calendarDraft.date, calendarDraft.status)
                }}
              >
                <label>
                  Date
                  <input
                    type="date"
                    min={dateOffset(0)}
                    value={calendarDraft.date}
                    onChange={(event) =>
                      setCalendarDraft({
                        ...calendarDraft,
                        date: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label>
                  Availability
                  <select
                    value={calendarDraft.status}
                    onChange={(event) =>
                      setCalendarDraft({
                        ...calendarDraft,
                        status: event.target.value as SlotStatus,
                      })
                    }
                  >
                    {["Available", "Limited", "Booked", "Unavailable"].map(
                      (status) => (
                        <option key={status}>{status}</option>
                      ),
                    )}
                  </select>
                </label>
                <button className="button button-dark">
                  Save availability
                </button>
              </form>
            </section>
            <section className="data-panel">
              <span className="eyebrow">UPCOMING REQUESTS</span>
              <h2>Booked dates</h2>
              {bookings
                .filter(
                  (booking) => booking.date && booking.status !== "Declined",
                )
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((booking) => (
                  <div className="enquiry-preview" key={booking.id}>
                    <span className="enquiry-bullet" />
                    <div>
                      <strong>
                        {displayDate(booking.date)} · {booking.time}
                      </strong>
                      <small>
                        {booking.institution} · {booking.status}
                      </small>
                    </div>
                  </div>
                ))}
            </section>
          </div>
        )}
        {adminTab === "Lecture topics" && (
          <div className="admin-module-grid">
            <section className="data-panel">
              <span className="eyebrow">CURATE THE CATALOGUE</span>
              <h2>Add a lecture topic</h2>
              <form className="compact-form" onSubmit={handleTopicSubmit}>
                <label>
                  Topic title
                  <input
                    required
                    value={topicDraft.title}
                    onChange={(event) =>
                      setTopicDraft({
                        ...topicDraft,
                        title: event.target.value,
                      })
                    }
                    placeholder="A clear, inviting title"
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={topicDraft.category}
                    onChange={(event) =>
                      setTopicDraft({
                        ...topicDraft,
                        category: event.target.value,
                      })
                    }
                    placeholder="e.g. Science, Arts, Careers"
                  />
                </label>
                <label>
                  Description
                  <textarea
                    required
                    rows={4}
                    value={topicDraft.description}
                    onChange={(event) =>
                      setTopicDraft({
                        ...topicDraft,
                        description: event.target.value,
                      })
                    }
                    placeholder="What will participants explore?"
                  />
                </label>
                <button className="button button-dark">Add topic</button>
              </form>
            </section>
            <section className="data-panel">
              <span className="eyebrow">PUBLISHED TOPICS</span>
              <h2>{topics.length} conversation starters</h2>
              {topics.map((topic) => (
                <div className="topic-admin-row" key={topic.id}>
                  <div>
                    <strong>{topic.title}</strong>
                    <small>
                      {topic.category} · {topic.duration}
                    </small>
                  </div>
                  {!starterTopics.some(
                    (starter) => starter.id === topic.id,
                  ) && (
                    <button
                      className="mini-action decline"
                      onClick={() => {
                        setTopics((items) =>
                          items.filter((item) => item.id !== topic.id),
                        )
                        logAction(`Topic ${topic.title} removed`)
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </section>
          </div>
        )}
        {adminTab === "Enquiries" && (
          <section className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">CRM · CONTACT FORM INBOX</span>
                <h2>Enquiries</h2>
                <p>
                  Customer contact form submissions are saved here in the demo
                  workspace.
                </p>
              </div>
              <span className="demo-pill">
                {enquiries.filter((item) => item.status === "New").length} NEW
              </span>
            </div>
            <div className="enquiries-list">
              {enquiries.map((item) => (
                <article className="enquiry-card" key={item.id}>
                  <div className="enquiry-card-head">
                    <span className="eyebrow">
                      {item.id} · {item.status}
                    </span>
                    <button
                      className="mini-action"
                      onClick={() =>
                        setEnquiries((items) =>
                          items.map((row) =>
                            row.id === item.id
                              ? { ...row, status: "Contacted" }
                              : row,
                          ),
                        )
                      }
                    >
                      Mark contacted
                    </button>
                  </div>
                  <h3>{item.subject}</h3>
                  <p>{item.message}</p>
                  <div className="enquiry-card-footer">
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        {item.email} · {item.organization}
                      </small>
                    </span>
                    <button
                      className="button button-dark button-small"
                      disabled={item.status === "Converted to booking"}
                      onClick={() => convertEnquiry(item)}
                    >
                      {item.status === "Converted to booking"
                        ? "Converted"
                        : "Convert to booking"}{" "}
                      <Icon name="arrow" size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {adminTab === "Customers" && (
          <section className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">INSTITUTION RELATIONSHIPS</span>
                <h2>Customers</h2>
                <p>Demo customer records derived from sample booking data.</p>
              </div>
              <label className="search-field">
                <Icon name="search" size={16} />
                <input
                  placeholder="Search customers"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Institution</th>
                    <th>Email</th>
                    <th>Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    .filter((item) =>
                      `${item.name} ${item.organization}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((item) => (
                      <tr key={item.email}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.organization}</td>
                        <td>{item.email}</td>
                        <td>{item.bookings}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {adminTab === "Lecturers" && (
          <div className="admin-module-grid">
            <section className="data-panel">
              <span className="eyebrow">SPEAKER ROSTER</span>
              <h2>Lecturer assignments</h2>
              <p>
                Assign a lecturer to a booking. This demo roster is not a real
                availability or contract system.
              </p>
              <label>
                Choose booking
                <select
                  value={selectedBooking}
                  onChange={(event) => setSelectedBooking(event.target.value)}
                >
                  <option value="">Select a booking</option>
                  {bookingOptions}
                </select>
              </label>
              <label>
                Assign lecturer
                <select
                  value={lecturer}
                  onChange={(event) => setLecturer(event.target.value)}
                >
                  {lecturers.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button
                className="button button-dark"
                disabled={!selectedBooking}
                onClick={() => {
                  if (selectedBooking) assignLecturer(selectedBooking, lecturer)
                }}
              >
                Assign lecturer
              </button>
              <div className="demo-auth-note">
                <Icon name="shield" size={17} />
                <span>
                  Assignments persist in this browser demo; a secure backend is
                  needed for a shared roster.
                </span>
              </div>
            </section>
            <section className="data-panel">
              <span className="eyebrow">DEMO SPEAKERS</span>
              <h2>{lecturers.length} listed lecturers</h2>
              {lecturers.map((person, index) => (
                <div className="topic-admin-row" key={person}>
                  <span className="review-avatar">
                    {person.split(" ").slice(-1)[0].slice(0, 1)}
                  </span>
                  <div>
                    <strong>{person}</strong>
                    <small>
                      {index === 0
                        ? "Leadership · Technology"
                        : "Entrepreneurship · Innovation"}
                    </small>
                  </div>
                </div>
              ))}
              <form
                className="add-lecturer-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (!newLecturer.trim()) return
                  setLecturers((items) => [...items, newLecturer.trim()])
                  setNewLecturer("")
                  logAction("Lecturer added to demo roster")
                }}
              >
                <input
                  value={newLecturer}
                  onChange={(event) => setNewLecturer(event.target.value)}
                  placeholder="Add lecturer name"
                  required
                />
                <button className="button button-outline button-small">
                  Add
                </button>
              </form>
            </section>
          </div>
        )}
        {adminTab === "Payments" && (
          <div className="admin-module-grid">
            <section className="data-panel payment-workspace">
              <span className="eyebrow">PAYMENT OPERATIONS</span>
              <h2>No real transactions in demo mode.</h2>
              <p>
                Payment collection, verification, partial payments, refunds,
                invoices, and receipts require a secure server and a payment
                provider configured with credentials. Never mark a payment as
                paid without verified gateway confirmation.
              </p>
              <div className="gateway-options">
                <span>UPI</span>
                <span>Cards</span>
                <span>Net banking</span>
                <span>Partial pay</span>
              </div>
              <span className="demo-pill">GATEWAY NOT CONFIGURED</span>
            </section>
            <section className="data-panel">
              <span className="eyebrow">QUOTATION DRAFT</span>
              <h2>Prepare a demo quotation</h2>
              <label>
                Related booking
                <select
                  value={selectedBooking}
                  onChange={(event) => setSelectedBooking(event.target.value)}
                >
                  <option value="">Choose request</option>
                  {bookingOptions}
                </select>
              </label>
              <label>
                Quoted amount (INR)
                <input
                  type="number"
                  min="1"
                  value={quotationAmount}
                  onChange={(event) => setQuotationAmount(event.target.value)}
                  placeholder="e.g. 35000"
                />
              </label>
              <label>
                Payment terms
                <textarea
                  rows={3}
                  value={quoteMessage}
                  onChange={(event) => setQuoteMessage(event.target.value)}
                  placeholder="e.g. 50% advance, balance after session"
                />
              </label>
              <button
                className="button button-dark"
                onClick={() => {
                  const amount = Number(quotationAmount)
                  if (
                    selectedBooking &&
                    Number.isFinite(amount) &&
                    amount > 0
                  ) {
                    createQuote(
                      selectedBooking,
                      amount,
                      quoteMessage.startsWith("Demo quotation")
                        ? ""
                        : quoteMessage.trim(),
                    )
                    setQuoteMessage(
                      "Demo quotation saved locally; not a legal invoice and no payment link was created.",
                    )
                  } else {
                    setQuoteMessage(
                      "Choose a booking and enter a quotation amount greater than zero.",
                    )
                  }
                }}
              >
                {quoteMessage.startsWith("Demo quotation")
                  ? "Draft saved locally"
                  : "Save quotation draft"}
              </button>
              <p className="form-note">
                Demo draft only—no invoice or payment link is generated.
              </p>
              <div className="quote-list">
                {quotes
                  .filter(
                    (quote) =>
                      !selectedBooking || quote.bookingId === selectedBooking,
                  )
                  .map((quote) => {
                    const booking = bookings.find(
                      (item) => item.id === quote.bookingId,
                    )
                    return (
                      <article className="quote-card" key={quote.id}>
                        <span className="eyebrow">
                          {quote.id} · {quote.status}
                        </span>
                        <strong>
                          {booking?.institution ?? quote.bookingId} · ₹
                          {quote.amount.toLocaleString("en-IN")}
                        </strong>
                        <small>
                          {quote.paymentTerms || "Payment terms not specified."}
                        </small>
                      </article>
                    )
                  })}
              </div>
            </section>
          </div>
        )}
        {adminTab === "Reviews" && (
          <section className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">COMMUNITY FEEDBACK</span>
                <h2>Verified reviews</h2>
                <p>
                  Public reviews can only be submitted from completed customer
                  bookings.
                </p>
              </div>
            </div>
            {reviews.map((review) => (
              <div className="admin-review-row" key={review.id}>
                <div>
                  <div className="stars">{"★".repeat(review.rating)}</div>
                  <strong>
                    {review.name} · {review.institution}
                  </strong>
                  <p>{review.text}</p>
                  <small>
                    {review.topic} · {review.status}
                  </small>
                </div>
                <div className="table-actions">
                  {review.status === "Pending review" ? (
                    <>
                      <button
                        className="mini-action approve"
                        onClick={() =>
                          setReviews((items) =>
                            items.map((item) =>
                              item.id === review.id
                                ? { ...item, status: "Published" }
                                : item,
                            ),
                          )
                        }
                      >
                        Publish
                      </button>
                      <button
                        className="mini-action decline"
                        onClick={() =>
                          setReviews((items) =>
                            items.filter((item) => item.id !== review.id),
                          )
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="status-pill status-approved">
                      Published
                    </span>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
        {adminTab === "Reports" && (
          <section className="data-panel">
            <span className="eyebrow">WORKSPACE SNAPSHOT</span>
            <h2>Demo reports</h2>
            <div className="report-bars">
              {[
                ["Pending", counts.pending],
                ["Approved", counts.approved],
                ["Completed", counts.complete],
                [
                  "Declined",
                  bookings.filter((item) => item.status === "Declined").length,
                ],
              ].map(([label, count]) => (
                <div className="report-bar-row" key={label}>
                  <span>{label}</span>
                  <div>
                    <i
                      style={{
                        width: `${Math.min(100, Math.max(6, (Number(count) / Math.max(1, bookings.length)) * 100))}%`,
                      }}
                    />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
            <div className="report-note">
              These counts reflect browser-local demo records only. Revenue and
              payment analytics are intentionally omitted because no verified
              transactions exist.
            </div>
          </section>
        )}
        {adminTab === "Notifications" && (
          <section className="data-panel">
            <span className="eyebrow">RECENT ACTIVITY</span>
            <h2>Notifications</h2>
            {notifications.map((item, index) => (
              <div className="notification-row" key={`${index}-${item}`}>
                <span>
                  <Icon name="bell" size={17} />
                </span>
                <div>
                  <p>{item}</p>
                  <small>Demo workspace</small>
                </div>
              </div>
            ))}
          </section>
        )}
        {adminTab === "Settings" && (
          <div className="admin-module-grid">
            <section className="data-panel">
              <span className="eyebrow">BRAND &amp; APPEARANCE</span>
              <h2>Workspace settings</h2>
              <div className="missing-logo-setting">
                <img
                  className="settings-brand-logo"
                  src="/ayuktha-logo.jpg"
                  alt="Original AYUKTHA company logo"
                />
                <div>
                  <strong>Original AYUKTHA logo integrated</strong>
                  <p>
                    The provided company image is used unchanged throughout the
                    application.
                  </p>
                </div>
              </div>
              <label>
                Interface theme
                <select
                  value={dark ? "Dark" : "Light"}
                  onChange={(event) => setDark(event.target.value === "Dark")}
                >
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </label>
              <p className="form-note">
                Theme colors follow the black, gold, and white palette of the
                original company branding.
              </p>
            </section>
            <section className="data-panel">
              <span className="eyebrow">SERVICE CONFIGURATION</span>
              <h2>What is still needed</h2>
              <ul className="setup-list">
                <li>
                  <Icon name="check" size={16} />
                  Frontend demo with browser-local persistence
                </li>
                <li>
                  <Icon name="close" size={16} />
                  Secure API and persistent database
                </li>
                <li>
                  <Icon name="close" size={16} />
                  Admin/customer authentication and roles
                </li>
                <li>
                  <Icon name="close" size={16} />
                  Payment provider credentials + webhook verification
                </li>
                <li>
                  <Icon name="check" size={16} />
                  Original AYUKTHA logo integrated unchanged
                </li>
                <li>
                  <Icon name="close" size={16} />
                  Email/SMS notification service
                </li>
              </ul>
            </section>
          </div>
        )}
        {adminTab === "Audit log" && (
          <section className="data-panel">
            <span className="eyebrow">LOCAL DEMO AUDIT</span>
            <h2>Recent admin actions</h2>
            <p>
              These entries are stored in this browser, and are not an immutable
              or security-grade audit trail.
            </p>
            <div className="audit-list">
              {audit.map((entry, index) => (
                <div key={`${index}-${entry}`}>
                  <Icon name="clock" size={16} />
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
