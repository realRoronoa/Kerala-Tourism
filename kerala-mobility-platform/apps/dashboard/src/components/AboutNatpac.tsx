import React from 'react';

const AboutNatpac: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm p-8 md:p-12 mb-8">
      <h2 className="text-3xl font-semibold text-gov-blue-primary uppercase tracking-wide mb-8 border-b-4 border-accent-orange pb-4">
        About NATPAC
      </h2>
      
      <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
        <section>
          <h3 className="text-xl font-semibold text-gov-blue-secondary mb-4">Origin & Growth</h3>
          <p className="mb-4">
            National Transportation Planning and Research Centre (NATPAC) was established by the Government of Kerala in 1976 to develop solutions to the traffic and transportation problems faced by the State. Owing to the contributions and achievements made by the institute, NATPAC was reconstituted as an autonomous R&D Centre under the Science, Technology and Environment Committee (STEC), Government of Kerala, in 1982. In November 2002, NATPAC was amalgamated with Kerala State Council for Science, Technology and Environment (KSCSTE), an autonomous body under the Science, Technology and Environment Committee (STEC), Government of Kerala, which was formed to adopt an integrated approach to the research and development activities in Kerala.
          </p>
          <p className="mb-4">
            Across nearly five decades of evolution, the National Transportation Planning and Research Centre (NATPAC) has emerged as a pivotal institution shaping especially Kerala’s transport landscape and contributing substantially to mobility initiatives. Its milestones, ranging from early involvement in the 1982 Delhi Asiad to foundational studies that led to the declaration of National Waterway No. 3, demonstrate an enduring legacy of scientific relevance and policy influence. Through sustained engagement in highway development, urban mobility planning, water transport enhancement, and advanced infrastructure design, NATPAC has consistently expanded its technical footprint and enhanced its stature as a trusted expert body.
          </p>
          <p>
            The organisation’s wide-ranging applied research and consultancy engagements, including road safety audits, accident analyses, tourism mobility planning, environmental assessments, large-scale infrastructure studies, and evidence-based fare-policy evaluations, reflect its indispensable role in supporting government decision-making. Its extensive safety outreach, comprising thousands of programmes, specialised driver training, specified community initiatives, and an impressive collection of educational and digital resources, has established NATPAC’s position as one of Kerala’s leading centres for road safety education.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gov-blue-secondary mb-4">The Organisation</h3>
          <p className="mb-4">
            NATPAC is one of the Research Institutions of KSCSTE, which is fully funded by the Government of Kerala. KSCSTE is constituted as an agency for bringing change and development through Science and Technology in the State. KSCSTE has a State Council headed by the Chief Minister of Kerala and an Executive Council chaired by the Executive Vice President.
          </p>
          <p className="mb-4">
            NATPAC is headed by the Director, who is advised on technical matters by the Research Council and on administrative matters by the Management Committee. The Scientists working in the Centre are specialised in different fields of transportation and allied areas, supported by Technical Officers and Technical Assistants. The Scientific and Technical Staff are organised into four scientific divisions, supported by Accounts and Administrative Sections.
          </p>
          <p className="mb-4">
            The main campus of NATPAC with a built–up area of 16,000 sq.ft, housing the scientific divisions, laboratories and library, is located in Thiruvananthapuram, the southern part of Kerala. NATPAC has two Regional Offices in North and Central Kerala, one functioning in the CWRDM campus, Kozhikode and the other one operating in Jawaharlal Nehru International Stadium, Ernakulam.
          </p>
          <p className="mb-4">
            The Centre has multidisciplinary expertise in Traffic Engineering, Transport Planning, Public Transport, Highway and Structural Engineering, Pavement Engineering, Geotechnical Engineering, Traffic Safety, Water Transportation, Geomatics, Transport Economics and Management. The Centre has associations with international and national agencies for carrying out specialised technical projects.
          </p>
          
          <h4 className="font-bold text-gray-900 mt-6 mb-2">The major thrust areas on which the research is focused are:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Traffic Safety/Intelligent Transportation System</li>
            <li>Marginal/Alternate materials for Transport Infrastructure</li>
            <li>Public Transport System and Logistics</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutNatpac;
