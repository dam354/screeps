# screeps
## Screeps Project

This project is a collection of scripts for the game Screeps, where players write JavaScript (or any other transpiled language) to control their units, known as "creeps", and manage their in-game operations.

### Overview

The codebase is structured into multiple key components:

- **Creep Behaviors**: Defined in `creepFunctions.js`, these functions dictate how creeps interact with the world, including harvesting energy and other resources.
- **Roles**: Each creep can have a role, such as a builder or carrier, which determines its behavior. These roles are defined in files like `role.builder.js` and `role.carrier.js`.
- **Room Management**: The `roomPositionFunctions.js` file contains utility functions for room position management, such as finding open positions or nearby positions.

### Creep Functions

Creeps are the primary agents in the game. They perform tasks like harvesting energy, building structures, and carrying resources. The `creepFunctions.js` file contains methods that are added to the Creep prototype, allowing all creeps to perform common tasks.

### Roles

Each creep can be assigned a specific role that defines its behavior:

- **Builder**: Defined in `role.builder.js`, builders are responsible for constructing and repairing structures.
- **Carrier**: Defined in `role.carrier.js`, carriers transport resources across the room to where they are needed most.

### Room Position Functions

The `roomPositionFunctions.js` file provides utility functions for working with room positions, which are essential for navigating and interacting with the game world.

### Getting Started

To get started with this project, clone the repository and deploy the scripts to your Screeps account. You may need to adjust the code to fit the specifics of your in-game situation, such as your room layout and your creeps' capabilities.

### Contributing

Contributions to the project are welcome. Please ensure that any pull requests maintain the existing code style and provide clear, concise descriptions of the changes made.

### License

This project is open-source and available under the [MIT license](LICENSE).

## TODO List for Creep Upgrades/Improvements

1. **Optimize Energy Harvesting** - Improve the efficiency of energy harvesting by creeps, possibly by implementing a queue system for sources to minimize wait times.
2. **Dynamic Body Parts** - Develop a system to dynamically adjust the body parts of creeps based on available resources and current needs of the colony.
3. **Role Specialization** - Refine the roles and behaviors of creeps to ensure that each role is as effective as possible, including specialized roles for defense, offense, and resource management.
4. **Automated Spawning Logic** - Create a more sophisticated logic for the automatic spawning of creeps based on the current and projected needs of the colony.
5. **Memory Management** - Implement a cleanup routine for memory objects associated with dead creeps to prevent memory leaks.
6. **Pathfinding Optimization** - Enhance the pathfinding algorithms to reduce CPU usage and improve the movement efficiency of creeps.
7. **Creep Renewal and Recycling** - Set up a system for the automatic renewal of creeps nearing the end of their lifespan and the recycling of creeps when they are no longer needed.
8. **Remote Operations** - Develop strategies for creeps to operate in remote rooms, including remote harvesting, claiming, and room defense.
9. **Market Integration** - Integrate market trading into the creep's behavior to sell excess resources and buy needed resources at favorable prices.
10. **Inter-Room Resource Balancing** - Create a system to balance resources across multiple rooms, ensuring that all rooms have the resources they need for growth and defense.
