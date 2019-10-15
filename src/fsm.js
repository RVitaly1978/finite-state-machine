class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error(`config isn't passed`);
        } else {
            this._config = config;
            this._currentState = this._config.initial;
            this._historyList = [this._currentState];
            this._countUndo = 0;
            this._currentIndex = 0;
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this._config.states[state] === undefined) {
            throw new Error(`state isn't exist`);
        } else {
            this._currentState = state;
            this._historyList.push(this._currentState);
            this._countUndo = 0;
            this._currentIndex = this._historyList.length - 1;
        }
        return this._currentState;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let _event = this._config.states[this._currentState].transitions[event];
        if (_event === undefined) {
            throw new Error(`event in current state isn't exist`);
        } else {
            this.changeState(_event);
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this._config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let _states = [];
        
        if (event == null) {
            for (let key in this._config.states) {
                _states.push(key);
            }

        } else {
            for (let key in this._config.states) {
                if (this._config.states[key].transitions[event] !== undefined) {
                    _states.push(key);
                }
            }
        }

        return _states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._currentIndex === 0) {
            return false;
        } else {
            this._currentState = this._historyList[this._currentIndex - 1];
            this._historyList.push(this._currentState);
            this._countUndo++;
            this._currentIndex--;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._countUndo === 0) {
            return false;
        } else {
            this._currentState = this._historyList[this._currentIndex + 1];
            this._historyList.push(this._currentState);
            this._countUndo--;
            this._currentIndex++;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._historyList = [this._currentState];
        this._countUndo = 0;
        this._currentIndex = this._historyList.length - 1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
