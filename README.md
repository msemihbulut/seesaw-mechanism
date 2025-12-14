# Seesaw Mechanism Simulation

An interactive web-based physics simulation that demonstrates torque and balance principles through a seesaw mechanism. Users place weights on a plank and observe real-time angle calculations.

## Project Overview

This application simulates a seesaw where users can interactively place weights. The system calculates torque based on weight and distance from the pivot point, updating the plank's angle accordingly. Features include visual feedback, activity history, and automatic state persistence.

## Technical Stack

- Vanilla JavaScript
- CSS3
- LocalStorage
- HTML5 Audio

## File Structure

```
seesaw-mechanism/
├── index.html          # Main HTML structure
├── script.js           # Application logic and physics simulation
├── style.css           # Styling and animations
├── sound-effect.mp3    # Audio feedback for weight placement
└── README.md           # This file
```

## Project Link

You can click the link to try out the project: https://msemihbulut.github.io/seesaw-mechanism/

## Thought Process

The project was developed incrementally, starting with basic HTML and CSS structure to establish the visual foundation. The core physics calculations were implemented next, focusing on torque-based angle computation. Once the fundamental mechanics were working, the focus shifted to user experience enhancements: weight preview for better interaction, activity history for tracking actions, and pause/resume functionality for analysis.

State persistence was added early to ensure user progress wasn't lost, followed by visual improvements like random color assignment and scale markers for spatial reference. Audio feedback was added last to provide immediate confirmation of user actions.

## Design Decisions

The application uses vanilla JavaScript without frameworks to keep it lightweight and simple. The physics model is simplified to prioritize responsiveness and user experience over physical accuracy. Torque calculations use a linear relationship between weight, distance, and angle.

The angle is limited to 30 degrees in either direction for visual clarity. The application uses a pivot-centered coordinate system and implements automatic state persistence through LocalStorage.

## Usage

1. Open `index.html` in a modern web browser.
2. Move your mouse over the plank to see a preview of the next weight.
3. Click anywhere on the plank to place a weight at that position.
4. Observe the real-time calculation of torque and angle.
5. Use the "Pause Mechanism" button to freeze the current state.
6. Use the "Reset Mechanism" button to clear all weights and start fresh.

## Trade-offs and Limitations

The simplified physics model does not account for complex properties like moment of inertia or friction, which was necessary to maintain real-time performance. The simulation is optimized for desktop viewing and may have layout issues on mobile devices. LocalStorage has capacity limits and does not sync across devices.

## Future Enhancements

Potential improvements include physics engine integration, weight removal functionality, export/import features and accessibility improvements.

## AI Assistance

AI tools were used for debugging. The core application logic, physics calculations, and implementation were developed independently.

## Author

Mustafa Semih Bulut

## License

This project is provided as-is for educational purposes.
