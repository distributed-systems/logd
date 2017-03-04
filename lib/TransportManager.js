{
    'use strict';



    module.exports = class TransportManager {



        constructor() {

            // storage for all registred transports
            this.transports = new Set();


            // maps for log routing
            this.levelMap = new Map();


            // storage for loglevel resolution
            this.loglevels = new Map();
        }



        sendMessage(message) {
            const level = message.getLevelNumber();
            if (this.levelMap.has(level)) {
                for (const transport of this.levelMap.get(level).values()) {
                    transport.message(message);
                }
            }
        }





        addLogLevelDescriptor(descriptor) {
            if (!this.loglevels.has(descriptor.name)) this.loglevels.set(descriptor.name, new Set());
            this.loglevels.get(descriptor.name).add(descriptor.level);

            // refresh routes
            this.computeRoutes();
        }





        computeRoutes() {
            // re-set map
            this.levelMap = new Map();

            for (const transport of this.transports.values()) this.computeRoute(transport);
        }





        computeRoute(transport) {
            transport.getLevels().forEach((level) => {
                switch (level.type) {
                    case 'range':
                        if (this.loglevels.has(level.from) && this.loglevels.has(level.to)) {
                            let from = 100;
                            let to = 0;
                            let i = 0;

                            for (const levelNumber of this.loglevels.get(level.from)) {
                                let fromLevel = levelNumber;
                                let toLevel = this.loglevels.get(level.to)[i];

                                // swap values
                                if (fromLevel > toLevel) [fromLevel, toLevel] = [toLevel, fromLevel];

                                if (fromLevel < from) from = fromLevel;
                                if (toLevel > to) to = toLevel;
                                i++;
                            }


                            // add for all level we have to
                            for (;from <= to; from++) {
                                this.addTransportToLevel(transport, from);
                            }
                        }
                        break;


                    case 'open-range':
                        if (this.loglevels.has(level.name)) {
                            for (const levelNumber of this.loglevels.get(level.name)) {
                                if (level.modifier === '+') {
                                    for (let i = levelNumber; i <= 100; i++) this.addTransportToLevel(transport, i);
                                } else {
                                    for (let i = levelNumber; i >= 0; i--) this.addTransportToLevel(transport, i);
                                }
                            }
                        }
                        break;


                    case 'level':
                        if (this.loglevels.has(level.name)) {
                            for (const levelNumber of this.loglevels.get(level.name)) {
                                this.addTransportToLevel(transport, levelNumber);
                            }
                        }
                        break;


                    case 'number-range':
                        let from = level.from;
                        let to = level.to;

                        // add for all level we have to
                        for (;from <= to; from++) {
                            this.addTransportToLevel(transport, from);
                        }
                        break;


                    default:
                        throw new Error(`unknown level type ${level.type}`);
                }
            });
        }





        addTransportToLevel(transport, levelNumber){
            if (!this.levelMap.has(levelNumber)) this.levelMap.set(levelNumber, new Set());
            this.levelMap.get(levelNumber).add(transport);
               
        }






        /**
        * add a transport
        *
        * @param {object} transportIntance an instance of a transport
        *
        * @returns {object} this
        */
        add(transportIntance) {

            // lock the transport, so that it
            // cannot be modified anymore
            transportIntance.lock();


            // get levels, pass them to the root 
            // so that only apppropriate logs are created
            this.computeRoute(transportIntance);



            // store
            this.transports.add(transportIntance);


            return this;
        }
    }
}
