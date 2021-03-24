### The technical detail of CPU: (4.2.2 Design)

The CPU abstract model is the model part of our project, who only processes data and does not control the animation. The idea of separating data model from animation comes from our FSE module where MVC design pattern was introduced. Model should not couple with View, and the Controller is responsible for the communication between Model and View. Guided by this principle, the decision was made to divide our group into two sub-group. One group would develop the Model of this project, the other was responsible for View and Controller.

The CPU is an abstract model of a real MIPS CPU. It ensures the correctness of rendering data and indicates how data flows between wires. The CPU is composed of several abstract model of real MIPS circuit components. Those components are listed as below:

* PC Register 
* Memory( including both instruction and data Memory)
* Register File(place where the data of registers stores)
* ALU(do calculating like add sub or nor shift. More detail can be found in the documentation of original code)
* Control Unit
* ALU Control
* 4 32bits-multiplexors
* 2 Adders

The design follows the idea of simulating how a real CPU works. Some wrapper classes such as "Wire" and "Wired" simulate the flow of electron. Some "component" classes , which implement most of basic functionalities of a real components, are an abstract model of real MIPS circuit components such as Class "RegisterFile","Memory","PC",etc. These "component" classes encapsulate all the data they hold and hide concrete implementation of their method, exposing only necessary API to external class. This means these classes processing data independently and do not interfere the work of each other. Thus, the coupling of code is low, which makes it easier for further maintenance. 

The code of CPU is written by Typescript - a type-strong language developed and maintained by Microsoft - which ensure the safe of data type and is more suitable for developing large projects. The reason of choosing Typescript rather than JavaScript is that it supports the syntax of ES6 and provides more robust testing and documentation tools. Those tools add difficulties to the process of development since we need to learn something new, but on the other hand, those tools reduce the time of debugging.

Some design patterns are utilized in this CPU model such as Singleton,observer and adaptor design pattern. Due to the limit of words, the report can not elaborate the detail of implementation. 

### obstacles:

In the process of developing this CPU model, some issues are difficult to solve. In this section, part of those problems are discussed. 

The first problem is how to write such a sophisticated model from scratch. The team has no previous developing experience about CPU model. The lack of guide pushed our team to explore the possibilities on our own. Books and journals were the place where we tried to find answers. Finally, the consensus was that our team should learn more about how a real CPU works and write classes simulates the functionalities of a real CPU. Under the guide of this spirit, the first version of our Class Diagram was drawn. 

The second problem is how those separate componential class communicate with each other. Since they process data independently, the change of state of one componential object will not trigger the change of another componential object. This is not the case of a real CPU whose components are connected by wires and the change of one component will trigger the change of all the connected components. This is fulfilled by electricity which is parallel and fast. The problem is solved after the adaption of observer design pattern and state design pattern. We created two new wrapper classes "Wire" and "Wired". If a class extends Class "Wired", it can be connected with another class which also extends Class "Wired". The two connected class can then set the trigger condition of state change by the means of adding a wire between pins of them. For instance, the ALU class is connected with data Memory. The change of ALU output Pin should trigger the change of data Memory's input Pin. The two class should therefore extend Wired class and add a wire of corresponding pins. After that, they can passing data to each other and watch the change they should response to.

The third problem is how to integrate Assembler into this CPU model and in what way can the Controller using the data processed by the CPU model. The detail will not be depicted here due to the word limitation. Some APIs are written to address the problem.



### Testing

Three kinds of testing methods are adapted by our teams: Unit Test, Function Test, User Test. Each test is designed for different purpose. The Unit Test can validate the robustness of our program and provide convenience for further maintenance, The function test ensures normal inputs will produce normal outputs, abnormal inputs cause exceptions being thrown. The User test confirms that whether our design meets the requirement of our target users and stakeholders.

#### Unit Testing

The Unit testing is written with the help of Jest - a kind of JavaScript testing frame work - which is developed by Facebook. The unit testing covered most of classes and functions we wrote. Two important indicators of whether the unit testing is good are coverage and correctness. Our code failed some unit testing at first,especially tests of handling with abnormal conditions. However, after refactoring our code, now our code can pass all the unit tests. So the correctness of our code was verified by our unit testing. The second indicator is coverage. The coverage of our unit testing is high, but not all the branches and all the condition are tested. The coverage rate of CPU testing is lowest - only 65%, but apart from CPU the coverage rates of testing other classes are high. All of them exceed 90%.

#### Function Testing

The Function testing is also done by Jest. All instructions our model support are tested. The function testing is to reassure that when new functions or new piece of code are adding to our code, the original functions will not change. This means the change of classes or functions will not invalidate the previous functions. If function testing fails, something will going wrong when users enter data(instructions) into our software. So it is necessary to pass all the function tests.

#### User Testing

写不动了，等yuheng那边来消息了，或者老白用了以后给出意见后再写



### Achievement

The CPU model supports 23 instructions as well as syscall, directives like .data,.ascii .

剩下的部分由assembler补充

