const fs = require('fs');
const { exec } = require('child_process');

const author = process.argv[2];

exec(
  `git log --author="${author}" --pretty=tformat: --shortstat`,
  (err, stdout, stderr) => {
    const total = stdout
      .split('\n')
      .map((line) => line.split(',').slice(1))
      .reduce(
        (acc, line) => {
          if (line.length === 0) return acc;

          if (line.length === 1) {
            const insertions = Number(line[0].trim().split(' ')[0]);
            acc[0] += insertions;
            return acc;
          }

          const deletions = Number(line[1].trim().split(' ')[0]);
          acc[1] += deletions;
          return acc;
        },
        [0, 0]
      );

    console.log(
      `${author} total changes: ${total[0]} insertions (+), ${total[1]} deletions (-)`
    );
  }
);
