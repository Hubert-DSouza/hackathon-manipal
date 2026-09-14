# SociTea

> **What’s happening around you?**  
> *Everyone sees the problem. SociTea shows the ripple.*

SociTea is a community-powered infrastructure awareness platform that connects what people observe in their surroundings to the infrastructure systems those events can affect.

A fallen tree can block a road. A blocked road can redirect traffic. That traffic can overload another junction and delay public transport or emergency access.

SociTea helps communities see these connections and helps planners understand where intervention can have the greatest effect.

---

## 📌 The Problem

Modern cities depend on highly interconnected infrastructure.

A disruption in one location can create consequences far beyond the original failure. A blocked road can overload alternative routes. A flooded junction can disrupt public transport. A damaged connection can increase pressure on surrounding infrastructure.

Traditional monitoring often focuses on individual assets or isolated incidents. This makes it difficult to understand how one disruption can propagate through the wider infrastructure network.

The problem is therefore not only identifying where a failure occurred. Planners also need to understand:

- **What infrastructure could be affected next?**
- **How far could the disruption spread?**
- **Which infrastructure connections are most important?**
- **Where would intervention have the greatest impact?**
- **How would different intervention decisions change the outcome?**

---

## 💡 Our Solution

SociTea combines two powerful layers:

### 1. Community Intelligence
People observe what is happening around them and contribute real-time reports.
Reports can describe events such as:
- Flooded roads
- Blocked drains
- Fallen trees
- Road closures
- Damaged junctions
- Transport disruptions
- Infrastructure failures

Other users can verify and interact with these reports, creating a continuously updated picture of what is happening across the city.

### 2. Infrastructure Intelligence
Behind the community feed, SociTea represents important infrastructure and their relationships as a connected network.

When a disruption occurs, the system traces its potential downstream effects through this network.

This creates a simple flow:
$$\text{What happened} \longrightarrow \text{What could it affect} \longrightarrow \text{Where should we intervene?}$$

---

## 🛠️ How SociTea Addresses the Problem Statement

### 1. Representing the Infrastructure Network
SociTea models selected infrastructure as a connected network.

The prototype includes infrastructure such as:
- Roads
- Junctions
- Drains
- Hospitals
- Bus terminals
- Other critical infrastructure

Each infrastructure element is represented with relevant information such as location, type, description, and criticality. Relationships between infrastructure elements describe how disruptions can propagate through the network.

### 2. Introducing Real-World Disruptions
Community reports act as real-world disruption inputs.
Examples include:
- A flooded road
- A blocked drain
- A road closure
- A damaged junction
- A fallen tree
- A transport disruption

A disruption can be associated with the infrastructure it affects, allowing the system to simulate what may happen when that infrastructure becomes impaired.

### 3. Examining Relationships and Wider Effects
When a disruption is introduced, SociTea's **Ripple Engine** traces connected infrastructure that could potentially be affected.

For example:
$$\text{Blocked Drain} \longrightarrow \text{Road Waterlogging} \longrightarrow \text{Traffic Diversion} \longrightarrow \text{Junction Congestion} \longrightarrow \text{Bus Route Disruption}$$

The system shows these relationships through a human-readable **"How it could spread"** view.

### 4. Identifying Critical Infrastructure
Not every infrastructure element has the same importance. SociTea evaluates the potential downstream impact of disruptions within the modeled network to highlight infrastructure where a single failure could affect several connected systems.

### 5. Finding Where Intervention Matters Most
SociTea compares possible intervention points based on the amount of downstream impact that could be avoided.

| Intervention | Potential disruptions avoided |
|---|---|
| Fix BKC Main Road | 4 |
| Clear Low-Lying Drain | 3 |
| Restore Central Junction | 2 |

### 6. Comparing Alternative Scenarios
- **If nothing changes:** The system calculates the potential ripple through the infrastructure network.
- **If the disruption is fixed:** The system recalculates the network with the selected intervention applied.

The two scenarios can then be compared to understand the potential reduction in downstream impact.

---

## 🔄 From Citizen Observation to Planner Decision

$$\text{People observe} \longrightarrow \text{Community verifies} \longrightarrow \text{Infrastructure network connects} \longrightarrow \text{Ripple Engine analyzes} \longrightarrow \text{Wider consequences visible} \longrightarrow \text{Interventions ranked} \longrightarrow \text{Better decisions}$$

---

## 📱 The SociTea Experience

### 🏠 Home
A recency-first local feed showing what is happening around the user.
- View nearby incidents
- Share observations
- Verify reports with **Hot** 🔥 / **Cold** ❄️ indicators
- Interact with community posts

### 🗺️ Map
A geographic view of reported disruptions and relevant infrastructure in Mumbai.

### ⚡ Ripple
A visual explanation of how a disruption could affect connected infrastructure.
- How it could spread
- Potentially affected infrastructure
- Potential impact
- What-if scenario comparison (**If nothing changes** vs **If fixed first**)

### 👤 Profile
Access via top-right header: user's activity, contributions, saved reports, and community credibility.

---

## ⚡ Core Product Loop

$$\textbf{SEE} \longrightarrow \textbf{VERIFY} \longrightarrow \textbf{CONNECT} \longrightarrow \textbf{UNDERSTAND} \longrightarrow \textbf{ACT} \longrightarrow \textbf{RESOLVE}$$

- **SEE:** Discover what is happening nearby.
- **VERIFY:** Build confidence through community confirmation.
- **CONNECT:** Link the disruption to relevant infrastructure.
- **UNDERSTAND:** Explore potential downstream effects.
- **ACT:** Identify and prioritize intervention opportunities.
- **RESOLVE:** Track the situation as it changes.

---

## 🧪 Prototype

The current prototype demonstrates the complete concept using a curated **Mumbai, India** infrastructure network.

It includes:
- Community incident feed
- Real incident photos (`pothole.jpg`, `flooding.jpg`, `garbage.jpg`, `unsafe_building.jpg`, `tree.jpg`)
- Community verification
- Infrastructure network representation
- Ripple analysis & engine
- Scenario comparison
- Supabase PostgreSQL schema DDL & seed queries

---

## 💻 Tech Stack

- **Frontend**: React + Vite, Leaflet.js maps, CSS Design System
- **Backend / Database**: Supabase (PostgreSQL, Realtime DB, Auth)
- **Infrastructure Engine**: Deterministic Graph Traversal (BFS)
- **Typography & Aesthetics**: Google Fonts Montserrat & Inter

---

## 🏆 Hackathon Alignment

- **Problem Statement**: Cascading Failure: When One Failure Becomes Many
- **Domain**: Disaster Resilience & Critical Infrastructure
- **SDG**: SDG 11 — Sustainable Cities and Communities
- **Hackathon Theme**: The Butterfly Effect
