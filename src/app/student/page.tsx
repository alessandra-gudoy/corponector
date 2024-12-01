import { getServerSession } from 'next-auth';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import StudentInfo from '@/components/StudentInfo';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import Link from 'next/link';
import { Company } from '@prisma/client';
// import CompanyCard from '@/components/CompanyCard';

const StudentPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const student = await prisma.student.findMany({
    where: {
      owner,
    },
  });
  const companies = await prisma.company.findMany({
    include: {
      positions: true,
    },
  });
  return (
    <main className="semi-transparent">
      <Container className="py-3">
        {student.map((s) => (
          <Row>
            <Col xs>
              <StudentInfo key={s.id} {...s} />
              <Container>
                <Button className="my-5">
                  <Link href={`/student/edit/${s.id}`} style={{ color: 'white' }}>Edit</Link>
                </Button>
              </Container>
            </Col>
            <Col md>
              <h1>Recommended Companies</h1>
              {companies.map((company: Company) => (
                <Container>
                  <h3>{company.name}</h3>
                  <h3>
                    Location:
                    {company.location}
                  </h3>
                  <h3>Overview: </h3>
                  <p>{company.overview}</p>
                  <h3>Emails: </h3>
                  <p>{Array.isArray(company.emails) ? company.emails.join(', ') : company.emails}</p>
                  <h3>Links: </h3>
                  <p>{Array.isArray(company.links) ? company.links.join(', ') : company.links}</p>
                  {/* <h3>Positions: </h3>
                  <ul>
                    {company.positions.map((position: Position) => (
                      <li key={position.title}>
                        <h3>{position.title}</h3>
                        <p>{position.description}</p>
                        <p>
                          Skills:
                          {Array.isArray(position.skills) ? position.skills.join(', ') : position.skills}
                        </p>
                        <p>
                          Job Type:
                          {position.jobType}
                        </p>
                        <p>
                          Number of Hires:
                          {position.numberOfHires}
                        </p>
                        <p>
                          Salary Range:
                          $
                          {position.salaryRange}
                        </p>
                      </li>
                    ))}
                  </ul> */}
                </Container>
              ))}
            </Col>
          </Row>
        ))}
      </Container>
    </main>
  );
};

export default StudentPage;
