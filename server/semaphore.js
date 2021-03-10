const sem = require('semaphore')(1);

function first() {
    sem.take(() => {
        console.log("First");
        setTimeout(() => sem.leave(), 1000);
    });
}

function second() {
    sem.take(() => {
        console.log("Second");
        sem.leave();
    });
}

first();
second();