import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaComments,
  FaBookOpen,
  FaRocket,
  FaRss,
} from "react-icons/fa";

const SupportPage = () => {
  // All FluxAudit-related activity items with fullContent for modal
  const allActivityItems = [
    {
      tag: "FluxAudit Users",
      title: "Junie: How to cancel command in Junie’s terminal?",
      time: "55 minutes ago",
      comments: 8,
      fullContent:
        "User Junie asked about cancelling commands in the FluxAudit terminal. The solution involves pressing Ctrl+C to safely abort running commands.",
    },
    {
      tag: "FluxAudit Alerts",
      title: "Alert system update causes unexpected email spikes",
      time: "1 hour ago",
      comments: 15,
      fullContent:
        "After the latest alert system update, some users noticed a spike in notification emails. The team is investigating to optimize alert frequency.",
    },
    {
      tag: "FluxAudit Reports",
      title: "Report generation sometimes missing recent transactions",
      time: "2 hours ago",
      comments: 12,
      fullContent:
        "A few reports generated within the last hour didn't include recent transaction data due to caching delays. A fix is being deployed shortly.",
    },
    {
      tag: "FluxAudit Users",
      title: "New user onboarding improvements rolled out",
      time: "3 hours ago",
      comments: 5,
      fullContent:
        "Onboarding flow has been simplified with clearer instructions and tooltips, improving first-time user experience.",
    },
    {
      tag: "FluxAudit Mobile",
      title: "Mobile alerts now support push notifications",
      time: "5 hours ago",
      comments: 7,
      fullContent:
        "The mobile web app now supports push notifications for alerts to keep users updated in real time.",
    },
    {
      tag: "FluxAudit Beta",
      title: "Beta testers requested enhanced filtering options",
      time: "1 day ago",
      comments: 9,
      fullContent:
        "Beta users have provided feedback requesting more advanced filters in audit report views, which is being prioritized.",
    },
  ];

  // State to show initially 3, then load more
  const [visibleActivities, setVisibleActivities] = useState(
    allActivityItems.slice(0, 3)
  );

  // Modal state
  const [modalActivity, setModalActivity] = useState(null);

  // Load 3 more activities on SEE MORE click
  const loadMoreActivities = () => {
    const nextCount = visibleActivities.length + 3;
    setVisibleActivities(allActivityItems.slice(0, nextCount));
  };

  // Accordion state for generalTopics and faqTopics
  const [openGeneralIndex, setOpenGeneralIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Your original generalTopics data
  const generalTopics = [
    {
      title: "Getting Started with FluxAudit",
      content: [
        "Creating your first audit workspace",
        "Inviting team members to your account",
        "Understanding your dashboard and key metrics",
      ],
    },
    {
      title: "Importing and Managing Data",
      content: [
        "Supported file formats (CSV, XLSX, JSON)",
        "Connecting third-party tools like Xero and QuickBooks",
        "Managing and cleaning uploaded data",
      ],
    },
    {
      title: "Creating and Customizing Reports",
      content: [
        "How to generate audit reports",
        "Customizing report layouts and fields",
        "Setting up recurring reports",
      ],
    },
    {
      title: "User Roles and Permissions",
      content: [
        "Setting up user roles (Admin, Auditor, Viewer)",
        "Restricting access to sensitive data",
        "Audit log of user activities",
      ],
    },
    {
      title: "Alert Rules and Notifications",
      content: [
        "Creating custom alert conditions",
        "Receiving alerts via email or Slack",
        "Disabling or editing existing rules",
      ],
    },
    {
      title: "Troubleshooting Common Issues",
      content: [
        "Unable to upload file",
        "Report not generating properly",
        "Dashboard showing incomplete data",
      ],
    },
  ];

  // Your original faqTopics data
  const faqTopics = [
    {
      title: "Can I use FluxAudit without an accounting background?",
      content: [
        "Yes, FluxAudit is designed to be user-friendly even for non-accountants.",
        "We provide tooltips, guides, and pre-built templates to help you generate reports easily.",
        "You can also invite your accountant or auditor to collaborate in your workspace.",
      ],
    },
    {
      title: "How often is the data refreshed in my dashboard?",
      content: [
        "Data imported from third-party tools is refreshed every 24 hours by default.",
        "You can manually trigger a refresh at any time from the Data tab.",
        "Real-time syncing is available on our Business and Enterprise plans.",
      ],
    },
    {
      title: "Is there a mobile version of FluxAudit?",
      content: [
        "Yes, we offer a mobile-friendly web version that works on all major browsers.",
        "A dedicated mobile app for iOS and Android is currently in development.",
        "You can still receive real-time alerts and view reports from your phone.",
      ],
    },
  ];

  // Accordion toggle functions
  const toggleGeneral = (index) =>
    setOpenGeneralIndex(openGeneralIndex === index ? null : index);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  return (
    <div className="min-h-screen bg-white text-black font-sans relative">
      {/* Top Navbar */}
      <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">FluxAudit</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600">
            CONTACT
          </button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600">
            SIGN IN
          </button>
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* This is the Search Box */}
      <div className="text-center mt-12 px-4">
        <h1 className="text-2xl font-semibold mb-4">How can we help?</h1>
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search Help Center"
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-6 text-sm text-gray-500 px-6">
        <a href="#" className="hover:underline">
          Help Center
        </a>{" "}
        &gt; FluxAudit Support
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 mt-8">
        <Tile icon={<FaComments className="text-3xl" />} title="Community Forum" />
        <Tile icon={<FaPhone className="text-3xl" />} title="Contact Support" />
        <Tile icon={<FaEnvelope className="text-3xl" />} title="Issue Tracker" />
        <Tile icon={<FaBookOpen className="text-3xl" />} title="Documentation" />
        <Tile icon={<FaRocket className="text-3xl" />} title="Early Access Program" />
        <Tile icon={<FaRss className="text-3xl" />} title="Blog" />
      </div>

      {/* Knowledge Base & FAQs */}
      <div className="px-6 mt-16">
        <h2 className="text-2xl font-semibold mb-6">Knowledge base</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-2">General</h3>
            {generalTopics.map((item, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <button
                  onClick={() => toggleGeneral(i)}
                  className="w-full text-left text-gray-800 font-medium flex justify-between items-center"
                >
                  <span>{openGeneralIndex === i ? "▾" : "▸"} {item.title}</span>
                </button>
                {openGeneralIndex === i && (
                  <div className="mt-2 pl-4 text-sm text-gray-600 space-y-1">
                    {item.content.map((line, index) => (
                      <p key={index}>• {line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">FAQs</h3>
            {faqTopics.map((item, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left text-gray-800 font-medium flex justify-between items-center"
                >
                  <span>{openFaqIndex === i ? "▾" : "▸"} {item.title}</span>
                </button>
                {openFaqIndex === i && (
                  <div className="mt-2 pl-4 text-sm text-gray-600 space-y-1">
                    {item.content.map((line, index) => (
                      <p key={index}>• {line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-16 mb-20">
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleActivities.map((item, i) => (
            <div
              key={i}
              onClick={() => setModalActivity(item)}
              className="border-t pt-2 cursor-pointer hover:bg-gray-100 rounded transition"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setModalActivity(item);
              }}
            >
              <p className="text-xs text-gray-500 mb-1">{item.tag}</p>
              <p className="text-sm font-medium">{item.title}</p>
              <div className="text-xs text-gray-400 mt-1 flex gap-4 items-center">
                {item.time && <span>🗨️ Comment added {item.time}</span>}
                {item.comments !== null && <span>💬 Number of comments: {item.comments}</span>}
              </div>
            </div>
          ))}
        </div>

        {visibleActivities.length < allActivityItems.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreActivities}
              className="flex items-center text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition"
            >
              <span className="text-xl mr-2">+</span>
              SEE MORE
            </button>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="border-t py-10 px-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <div className="space-y-2 text-gray-700">
          <p className="flex items-center gap-2">
            <FaEnvelope /> mamoose@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhone /> +27 (012) 123-4567
          </p>
          <p className="flex items-center gap-2">
            <FaComments /> Live chat available 24/7
          </p>
        </div>
      </div>

      {/* Modal for activity */}
      {modalActivity && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setModalActivity(null)}
          />
          {/* Modal content */}
          <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
              <button
                onClick={() => setModalActivity(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
              <p className="text-xs text-gray-500 mb-2">{modalActivity.tag}</p>
              <h3 className="text-xl font-semibold mb-4">{modalActivity.title}</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {modalActivity.fullContent || "No additional details available."}
              </p>
              <div className="mt-6 text-xs text-gray-400">
                🗨️ Comments: {modalActivity.comments} | Last updated: {modalActivity.time} {/* to keep up with comments */ }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Tile = ({ icon, title }) => (
  <div className="border rounded p-6 text-center hover:shadow-lg transition">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-lg font-medium">{title}</div>
  </div>
);

export default SupportPage;
