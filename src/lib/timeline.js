import mitt from 'mitt';

export default (e = []) => {
  const timeline = mitt();
  let lastIndex = 0;
  let lastTime;
  let events;

  Object.assign(timeline, {
    add(event) {
      events.push(event);
      events.sort((a, b) => a.time - b.time);
    },

    remove(event, _index = events.indexOf(event)) {
      if (_index !== -1) {
        if (_index < lastIndex) lastIndex -= 1;
        events.splice(_index, 1);
      }
    },

    replace(newEvents) {
      events = newEvents.slice(0);
      events.sort((a, b) => a.time - b.time);
    },

    tick(time = 0) {
      if (time < lastTime) {
        lastIndex = 0;
      }

      for (let i = lastIndex; i < events.length; i++) {
        const event = events[i];
        if (time < event.time) break;
        timeline.emit(event.name, event);

        // call optional callback
        if (event.callback) {
          event.callback(event);
        }

        lastIndex += 1;
        if (event.once) {
          timeline.remove(event, i);
        }
      }
      lastTime = time;
    },
  });

  timeline.replace(e);

  return timeline;
};