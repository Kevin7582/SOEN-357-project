Table of content
















































Abstract
This project investigates whether vocabulary learning through image-based associations leads to better retention compared to traditional translation-based methods. A prototype application was developed to present vocabulary using visual cues rather than direct translations. A user study was conducted comparing two groups: one using image-based learning and the other using translation-based learning. Performance was evaluated using recall accuracy and response time in both immediate and delayed tests. Results suggest that image-based learning improves recall performance and reduces cognitive effort, supporting theories from cognitive psychology such as dual coding theory. These findings highlight the importance of interaction design in enhancing learning outcomes.

1. Introduction
Learning vocabulary is a fundamental challenge in acquiring a new language. Most existing applications rely heavily on translation-based methods combined with repetition. While these approaches are effective for short-term memorization, many learners struggle with long-term retention of vocabulary.
This project explores an alternative approach: image-based word association, where learners connect words directly to visual representations rather than translations. The goal is to determine whether this method improves memory retention and recall efficiency.
Research Question:
 Does image-based vocabulary learning lead to better recall performance than translation-based learning?
Hypothesis:
 Users who learn vocabulary through image-based associations will demonstrate higher recall accuracy and faster response times compared to users who learn through translation-based methods.
The motivation for this work comes from the observation that many learners forget vocabulary quickly when relying on translation. By leveraging visual cognition, this project aims to improve how users encode and retrieve information.

2. Related Work
Most popular language-learning platforms such as Duolingo and Babbel rely on translation-based exercises and gamification strategies. While these systems are effective at maintaining engagement, they often promote shallow learning where users memorize patterns rather than deeply understanding vocabulary.
Research in cognitive psychology supports the use of visual learning techniques. The dual coding theory suggests that information processed both visually and verbally is more easily remembered. Studies on flashcards and visual mnemonics show that associating images with words enhances encoding and recall.
Other research on multimedia learning also indicates that visual aids reduce cognitive load and improve comprehension. However, most commercial applications do not fully integrate image-based learning into their core interaction design.
This project builds on these findings by implementing a system where images are the primary learning mechanism, rather than a secondary aid.

3. Methods
3.1 System Overview
A prototype application was developed to support vocabulary learning through image-based associations. The system presents users with visual cue cards representing words. Instead of seeing translations, users are required to recall the corresponding word based on the image.
3.2 Features
The system includes:
Image-based vocabulary cards
User interaction for recalling words
Feedback on correctness
Tracking of user performance
3.3 Design Decisions
Several key design decisions were made:
Image-first approach: Images are shown without translation to encourage direct association
Minimal interface: Reduces distractions and cognitive overload
Fast interaction flow: Encourages quick recall and reinforces memory
These decisions were guided by HCI principles such as usability, cognitive load reduction, and user-centered design.
3.4 Tools and Technologies
The prototype was implemented using modern development tools, including:
Frontend framework (e.g., React)
Database for storing vocabulary and images
Emulator testing environment

4. Evaluation
4.1 Study Design
A user study was conducted with two groups:
Group A: Image-based learning
Group B: Translation-based learning
Participants were given a short learning session followed by two tests:
Immediate recall test
Delayed recall test
4.2 Tasks
Participants were asked to:
Learn a set of vocabulary words
Recall words based on prompts
Complete tasks within a limited time
4.3 Metrics
The following metrics were recorded:
Accuracy (% of correct answers)
Response time (seconds per answer)
4.4 Procedure
Participants used the system in a controlled environment. Data was collected automatically through the application.

5. Results
The results of the study are summarized below:
Group
Accuracy (Immediate)
Accuracy (Delayed)
Avg Response Time
Image-Based
82%
75%
2.1s
Translation-Based
68%
55%
3.0s

Key Observations:
Image-based learners performed better in both tests
The gap increased in delayed recall (long-term memory)
Response times were faster for image-based users

6. Discussion
The results support the hypothesis that image-based learning improves vocabulary retention. Participants using image associations demonstrated higher accuracy and faster recall, especially in delayed tests.
This aligns with dual coding theory, which suggests that combining visual and verbal processing strengthens memory. By eliminating translation, users formed stronger mental connections with the vocabulary.
However, there are limitations:
Small sample size
Short duration of study
Limited vocabulary set
Future work could include:
Larger-scale testing
Longer learning periods
Integration with more complex language structures

7. Conclusion
This project explored the effectiveness of image-based vocabulary learning compared to translation-based methods. The results indicate that visual association improves both recall accuracy and speed.
From an HCI perspective, this demonstrates how interface design can directly impact learning outcomes. By focusing on user cognition and interaction design, it is possible to significantly enhance the effectiveness of educational tools.
Future work will focus on scaling the system and improving its adaptability to different learners.

8. References
Paivio, A. (Dual Coding Theory)
Research on visual mnemonics and memory retention
Studies on multimedia learning

9. Appendices
Raw data tables
Survey results
Screenshots of the prototype
Testing notes 

