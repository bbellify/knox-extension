export function navPrev() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ionicon"
      viewBox="0 0 512 512"
    >
      <title>previous</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
        d="M244 400L100 256l144-144M120 256h292"
      />
    </svg>
  );
}

export function navNext() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ionicon"
      viewBox="0 0 512 512"
    >
      <title>next</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
        d="M268 112l144 144-144 144M392 256H100"
      />
    </svg>
  );
}

export function generateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[20px]"
      viewBox="0 0 512 512"
    >
      <title>generate password</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M448 341.37V170.61A32 32 0 00432.11 143l-152-88.46a47.94 47.94 0 00-48.24 0L79.89 143A32 32 0 0064 170.61v170.76A32 32 0 0079.89 369l152 88.46a48 48 0 0048.24 0l152-88.46A32 32 0 00448 341.37z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M69 153.99l187 110 187-110M256 463.99v-200"
      />
      <ellipse cx="256" cy="152" rx="24" ry="16" />
      <ellipse cx="208" cy="296" rx="16" ry="24" />
      <ellipse cx="112" cy="328" rx="16" ry="24" />
      <ellipse cx="304" cy="296" rx="16" ry="24" />
      <ellipse cx="400" cy="240" rx="16" ry="24" />
      <ellipse cx="304" cy="384" rx="16" ry="24" />
      <ellipse cx="400" cy="328" rx="16" ry="24" />
    </svg>
  );
}

export function refreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[20px]"
      viewBox="0 0 512 512"
      // viewBox="0 0 550 550"
    >
      <title>get latest</title>
      <path
        d="M320 146s24.36-12-64-12a160 160 0 10160 160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 58l80 80-80 80"
      />
    </svg>
  );
}

export function expandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[20px]"
      viewBox="0 0 512 512"
    >
      <title>open app</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
      />
    </svg>
  );
}

export function lockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[20px]"
      viewBox="0 0 512 512"
    >
      <title>lock</title>
      <path
        d="M336 208v-95a80 80 0 00-160 0v95"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <rect
        x="96"
        y="208"
        width="320"
        height="272"
        rx="48"
        ry="48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}

export function copyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[15px]"
      viewBox="0 0 512 512"
    >
      <title>copy</title>
      <rect
        x="128"
        y="128"
        width="336"
        height="336"
        rx="57"
        ry="57"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}

export function closeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[15px]"
      viewBox="0 0 512 512"
    >
      <title>close</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="40"
        d="M368 368L144 144M368 144L144 368"
      />
    </svg>
  );
}
