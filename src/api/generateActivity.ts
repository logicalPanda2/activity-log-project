const DATABASE: DATABASE = {
    SUBJECTS: [
        "John",
        "Jane",
        "Jack",
        "Jilliana",
        "Anthony"
    ],
    PREDICATES: [
        ["uploaded", "UPLOAD"],
        ["reported", "REPORT"],
        ["updated", "UPDATE"],
    ],
    OBJECTS: [
        "a picture of a cat",
        "a bug in a newly uploaded game",
        "a social media post",
        "a commit to a repository",
        "a foul in a baseball game",
        "found footage of bigfoot",
        "a new tech trend",
        "an ominous puzzle",
        "a thriller-comedy movie",
        "yet another dry joke",
    ]
}

function generateActivity(): Activity {
    const subjectIndex = Math.floor(Math.random() * DATABASE.SUBJECTS.length);
    const predicateIndex = Math.floor(Math.random() * DATABASE.PREDICATES.length);
    const objectIndex = Math.floor(Math.random() * DATABASE.OBJECTS.length);

    const activity: Activity = {
        title: `${DATABASE.SUBJECTS[subjectIndex]} ${DATABASE.PREDICATES[predicateIndex][0]} ${DATABASE.OBJECTS[objectIndex]}`,
        id: crypto.randomUUID(),
        status: "UNREAD",
        type: DATABASE.PREDICATES[predicateIndex][1],
        creator: DATABASE.SUBJECTS[subjectIndex],
        formattedCreationTime: getFormattedTime(),
        date: getDate(),
        month: getMonth(),
        year: getYear(),
    }

    return activity;
}

function getDate(): number {
    return new Date().getDate();
}

function getMonth(): number {
    return new Date().getMonth() + 1;
}

function getYear(): number {
    return new Date().getFullYear();
}

function getFormattedTime(): string {
    const now = new Date();

    const date = getDate().toString().padStart(2, "0");
    const month = getMonth().toString().padStart(2, "0");
    const year = getYear().toString();

    const seconds = now.getSeconds().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");

    return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function simulateNetwork<T>(
    callback: () => T, 
    {
        minDelay = 250,
        maxDelay = 1000,
        failureRate = 0.05,
        generateError = () => new Error("An unexpected error occured"),
    }: {
        minDelay?: number,
        maxDelay?: number,
        failureRate?: number,
        generateError?: () => Error,
    } = {}
) {
    return async function() {
        const delay = minDelay + Math.random() * (maxDelay - minDelay);

        await new Promise(r => setTimeout(r, delay));

        if(Math.random() < failureRate) throw generateError();

        return callback();
    }
}

const activityAPI = simulateNetwork<Activity>(generateActivity);

export default activityAPI;