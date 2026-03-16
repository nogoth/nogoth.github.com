<template>
  <div class="home-container">
    <aside class="articles-sidebar">
      <SidebarNav />
    </aside>

    <main class="resume-main">
      <div class="resume-container">
        <div class="resume-header">
          <h1>Benjamin Livingood, MS</h1>
          <p class="resume-title">Software Engineer</p>
          <div class="resume-contact">
            <span><a href="mailto:livingood@gmail.com">livingood@gmail.com</a></span>
            <span class="sep">|</span>
            <span><a href="https://www.linkedin.com/in/benjamin-livingood-ms-a135438" target="_blank">LinkedIn</a></span>
            <span class="sep">|</span>
            <span>Belgrade, MT</span>
          </div>
        </div>

        <div class="resume-summary">
          <p>A ten year+ Software Engineer, I specialize in increasing stability of production systems while working at a high speed. Having engineered and maintained scalable infrastructure reliably handling high traffic I also maintain audit-compliant code, while keeping up to date with current trends and protocols.</p>
        </div>

        <section class="resume-section">
          <h2>Core Skills</h2>
          <div class="skills-grid">
            <div class="skill-group">
              <h3>Languages</h3>
              <div class="skill-tags">
                <span class="skill-tag" v-for="s in ['Go', 'Java', 'Kotlin', 'Python', 'Perl', 'Bash']" :key="s">{{ s }}</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>Cloud & Infrastructure</h3>
              <div class="skill-tags">
                <span class="skill-tag" v-for="s in ['AWS', 'Kubernetes', 'Docker', 'Helm', 'Terraform', 'RDS', 'Linux', 'Microservices']" :key="s">{{ s }}</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>Observability & Support</h3>
              <div class="skill-tags">
                <span class="skill-tag" v-for="s in ['New Relic', 'Splunk', 'Jira', 'SaaS', 'Sumo', 'Grafana']" :key="s">{{ s }}</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>Tools & CI/CD</h3>
              <div class="skill-tags">
                <span class="skill-tag" v-for="s in ['GitHub Actions', 'Git', 'Maven', 'GitHub Copilot']" :key="s">{{ s }}</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>Databases</h3>
              <div class="skill-tags">
                <span class="skill-tag" v-for="s in ['MySQL', 'Cassandra', 'MongoDB', 'RDS']" :key="s">{{ s }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="resume-section">
          <h2>Work Experience</h2>

          <div class="job">
            <div class="job-header">
              <div>
                <h3>Software Development Engineer in Test</h3>
                <p class="job-company">Workiva</p>
              </div>
              <span class="job-dates">Jun 2023 – Sep 2025</span>
            </div>
            <p class="job-summary">As a Software Development Engineer in Test, it was my responsibility to create integration systems and tests for the developers of the GRC backend system to quickly and accurately test the database server and provide support to developers to ship to production, in addition to performing library/security upgrades and ensuring high site reliability.</p>
            <ul>
              <li>Wrote software and test suite for production code to conform with FIPS140 compliance (Kotlin/Java)</li>
              <li>Actively worked in Product Support role (weekly rotation)</li>
              <li>Moved all team repositories to use GitHub Actions (GHA), 2 months before deadline within 3 days</li>
              <li>Integrated deployment workflow into team chat, increased daily deploys 5x</li>
              <li>Wrote playbooks on how production software worked, how to debug it, security compliance</li>
              <li>Onboarded multiple developers to the team, assisting with common setup problems, documenting gaps in process and addressing them, demonstrating and instilling best/known practices to get jobs complete on time</li>
              <li>Implemented and adjusted key metrics for production systems, increasing uptime and monitoring</li>
            </ul>
          </div>

          <div class="job">
            <div class="job-header">
              <div>
                <h3>Software Engineer</h3>
                <p class="job-company">Workiva · Bozeman, MT</p>
              </div>
              <span class="job-dates">Sep 2012 – Jun 2023</span>
            </div>
            <p class="job-summary">As a member of the Workiva Development team I develop best-in-class, next-generation collaborative applications for accounting and finance teams around the world, using Google AppEngine, Amazon EC2, Python, GCE, Cassandra, git, Terraform, Kubernetes and Docker. I work on problems ranging from real time collaborative editing to distributed map-reduce algorithms to data warehousing on the latest cloud technologies.</p>
            <ul>
              <li>Implemented open sourced alternative to existing software, saved $1.6 million in production system licensing costs</li>
              <li>Engineered scalable Kubernetes solutions to optimize production systems on AWS, reducing annual cloud costs by $100,000 and demonstrating strong expertise in Cloud Native and Infrastructure as Code principles</li>
              <li>Created ChatOps agent for daily use by developers</li>
              <li>Maintained and extended a Maven-built Kotlin/Java stack, applying software library updates, implementing observability metrics with two separate database backends (MySQL and Cassandra)</li>
              <li>Worked with Google AppEngine, Amazon EC2, Terraform, and Docker to implement distributed systems and map-reduce algorithms on cloud infrastructure</li>
            </ul>
          </div>

          <div class="job">
            <div class="job-header">
              <div>
                <h3>Systems Engineer</h3>
                <p class="job-company">Oracle · Bozeman, MT</p>
              </div>
              <span class="job-dates">Mar 2012 – Aug 2012</span>
            </div>
            <p class="job-summary">Continued RightNow role post-acquisition. Designed, tested, and built infrastructure handling billions of hits per month on commodity hardware and open-source software. Assisted in security audits and compliance for government entities using the cloud.</p>
            <ul>
              <li>Maintain and operate data center infrastructure for Sales Training as well as quality assurance software development product testing</li>
              <li>Prototype and demonstrated open source alternative to using VMWare using KVM containers</li>
              <li>Using MongoDB, Postfix and Python to create a realtime, durable messaging system for use in Network Operations Center and production systems troubleshooting (response time to events reduced from 10 minutes to 1–2 minutes per event)</li>
            </ul>
          </div>

          <div class="job">
            <div class="job-header">
              <div>
                <h3>Linux Systems Engineer</h3>
                <p class="job-company">RightNow</p>
              </div>
              <span class="job-dates">Jan 2010 – Mar 2012</span>
            </div>
            <p class="job-summary">Owned and maintained cloud-based infrastructure, implementing and extending backup, mail, and web pool systems. Liaised with government entities on security and compliance. Architected new solutions with zero impact on existing services while applying security patches and maintaining ticket-based transparency.</p>
            <ul>
              <li>Implemented highly scalable, redundant backup strategy using MogileFS</li>
              <li>Completed hardware and software refresh of entire web pool infrastructure</li>
              <li>Implemented eCelerity mail solution for production email delivery</li>
              <li>Helped draft and implement parts of the Search product</li>
              <li>Drafted and prototyped alternative to VMware for internal testing infrastructure</li>
              <li>Backported features for customers; owned Sales/Demo, internal testing, and legacy infrastructure</li>
            </ul>
          </div>

          <div class="job">
            <div class="job-header">
              <div>
                <h3>Systems Administrator</h3>
                <p class="job-company">Montana State University</p>
              </div>
              <span class="job-dates">Jan 1999 – Jan 2010</span>
            </div>
            <p class="job-summary">Administered Linux systems for the Center for Computational Biology and Research Computing Group. Maintained email servers, web servers, DNS, VPN, backup systems, and Beowulf compute clusters. Applied security patches, managed hardware procurement, and provided support for faculty, staff, and students.</p>
            <ul>
              <li>Built student Gmail provisioning service for the Montana University System (4 campuses)</li>
              <li>Operated four-campus mail portal cluster handling ~1,000,000 emails per week</li>
              <li>Virtualized services onto KVM cluster; built DRBD/OpenVZ HA cluster for critical services</li>
              <li>Implemented Puppet-based scalable web development deployments</li>
              <li>Installed and maintained Beowulf compute cluster for research workloads</li>
              <li>Created KFLEX, an intelligent traffic-adaptive firewall solution for NetBSD</li>
              <li>Implemented VPN server solution and sitewide wireless/firewall for offsite personnel</li>
            </ul>
          </div>
        </section>

        <section class="resume-section">
          <h2>Education</h2>
          <div class="education">
            <div class="edu-entry">
              <div class="edu-header">
                <h3>Masters Computer Science</h3>
                <span class="edu-year">2002</span>
              </div>
              <p class="edu-school">Montana State University–Bozeman</p>
              <p class="edu-focus">Data Mining, Artificial Intelligence, Information Theory</p>
            </div>
            <div class="edu-entry">
              <div class="edu-header">
                <h3>Bachelor Computer Science</h3>
                <span class="edu-year">1999</span>
              </div>
              <p class="edu-school">Montana State University–Bozeman</p>
              <p class="edu-focus">Graphics/Image Processing, Compiler Theory</p>
            </div>
          </div>
        </section>

        <section class="resume-section">
          <h2>Languages</h2>
          <div class="languages">
            <span class="lang-entry">Spanish <em>(Elementary)</em></span>
            <span class="lang-entry">French <em>(Elementary)</em></span>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarNav from '@/components/SidebarNav.vue'
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.articles-sidebar {
  border-right: 2px solid #eee;
  padding-right: 2rem;
}

.resume-main {
  overflow-y: auto;
}

.resume-container {
  max-width: 900px;
  background-color: var(--spaceman-surface);
  color: var(--spaceman-dark);
  border: 4px solid var(--spaceman-dark);
  box-shadow: 15px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 2.5rem;
}

/* Header */
.resume-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 4px solid var(--spaceman-dark);
}

.resume-header h1 {
  margin: 0 0 0.25rem;
  color: var(--spaceman-dark);
  font-size: 2rem;
  letter-spacing: 2px;
}

.resume-title {
  font-size: 1.2rem;
  color: var(--spaceman-action);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1rem;
}

.resume-contact {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.resume-contact a {
  color: var(--spaceman-action);
  font-weight: 700;
}

.resume-contact .sep {
  color: var(--spaceman-primary);
  opacity: 0.5;
}

/* Summary */
.resume-summary {
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.6);
  border-left: 4px solid var(--spaceman-action);
  border-radius: 0 4px 4px 0;
  line-height: 1.7;
}

.resume-summary p {
  margin: 0;
}

/* Sections */
.resume-section {
  margin-bottom: 2rem;
}

.resume-section h2 {
  color: var(--spaceman-dark);
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 4px solid var(--spaceman-action);
  padding-bottom: 0.5rem;
  margin: 0 0 1.25rem;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.skill-group h3 {
  font-size: 0.85rem;
  color: var(--spaceman-primary);
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-left: 3px solid var(--spaceman-action);
  padding-left: 0.5rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.skill-tag {
  background-color: var(--spaceman-action);
  color: var(--spaceman-surface);
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid var(--spaceman-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Jobs */
.job {
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid var(--spaceman-dark);
  border-radius: 4px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.15);
  position: relative;
}

.job::after {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--spaceman-action), transparent);
  border-radius: 4px 4px 0 0;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.job-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--spaceman-dark);
}

.job-company {
  margin: 0.15rem 0 0;
  color: var(--spaceman-action);
  font-weight: 700;
  font-size: 0.9rem;
}

.job-dates {
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--spaceman-primary);
  background: rgba(75, 83, 32, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
  border: 1px solid var(--spaceman-primary);
  letter-spacing: 0.5px;
}

.job-summary {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--spaceman-dark);
  opacity: 0.85;
  margin: 0 0 0.75rem;
}

.job ul {
  margin: 0;
  padding-left: 1.25rem;
}

.job li {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.job li::marker {
  color: var(--spaceman-action);
}

/* Education */
.education {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edu-entry {
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid var(--spaceman-dark);
  border-radius: 4px;
  box-shadow: 3px 3px rgba(0, 0, 0, 0.1);
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edu-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--spaceman-dark);
}

.edu-year {
  font-weight: 700;
  color: var(--spaceman-primary);
  font-size: 0.85rem;
  background: rgba(75, 83, 32, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  border: 1px solid var(--spaceman-primary);
}

.edu-school {
  margin: 0.25rem 0 0;
  color: var(--spaceman-action);
  font-weight: 700;
  font-size: 0.9rem;
}

.edu-focus {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--spaceman-dark);
  opacity: 0.8;
  font-style: italic;
}

/* Languages */
.languages {
  display: flex;
  gap: 1.5rem;
}

.lang-entry {
  font-size: 0.95rem;
  color: var(--spaceman-dark);
}

.lang-entry em {
  color: var(--spaceman-primary);
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .home-container {
    grid-template-columns: 250px 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .articles-sidebar {
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0;
    min-height: auto;
  }

  .articles-sidebar {
    border-right: none;
    border-bottom: 2px solid #eee;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .resume-main {
    padding: 1rem;
  }

  .resume-container {
    padding: 1.5rem;
    box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  }

  .resume-header h1 {
    font-size: 1.5rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .job-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .edu-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .languages {
    flex-direction: column;
    gap: 0.5rem;
  }

  .resume-contact {
    flex-direction: column;
    gap: 0.25rem;
  }

  .resume-contact .sep {
    display: none;
  }
}
</style>
