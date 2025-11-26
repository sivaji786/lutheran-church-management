import React from 'react';
import { Church, Users, Heart, Music, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function LCHydPage() {
  const ministries = [
    {
      icon: BookOpen,
      title: 'Sunday School',
      description: 'As Jesus Christ announces not to obstruct the Children from going to Christ, the Lutheran Church instils the same and strives to provide the Children with the Knowledge of God, His Son Jesus Christ and the Holy Spirit. The Church gives a platform for the Children to showcase their talents through playing Musical Instruments, Singing, Playing Skits in Annual programs like Sunday School Christmas, processions and rallies on Palm Sunday, and Sunday School Sunday and the VBS program.'
    },
    {
      icon: Users,
      title: 'Youtheran',
      description: 'The Youth Fellowship of the Lutheran Church, Hyderabad "A-1" Parish has a unique name "Youtheran." Since inception, the youth fellowship has been an integral part of the Church ministry. The year 2024 marked the highest number of 35 Confirmants on Palm Sunday. The Youtheran takes pride in serving the needs of the Church by participating in decorations, Bible Study, organizing retreats, representing AELC in various global platforms, participation in Choir, and leading Praise and Worship.'
    },
    {
      icon: Heart,
      title: 'Women Samaj',
      description: 'The Lutheran Church has always recognized the importance of women in the Church and their role in the furtherance of ministry. The women of the Church have always risen to the occasion when needed and have efficiently served the Lord resulting in the development of the Church. They are recognized for their Hospitality, Fundraising, Decoration Ideas, and more. The Women Samaj meets on every Second and Fourth Sundays to cater to their spiritual needs.'
    },
    {
      icon: Users,
      title: 'Senior Citizen Fellowship',
      description: 'The Lutheran Church, Hyderabad "A-1" Parish has initiated a Bible Study program for Senior Citizens in January 2024 by the interest instigated by Rev. Dr. G. Jeevan Kumar. This fellowship addresses the spiritual needs of the Senior Citizens with the guidance of the Pastors for a smoother running of the Church and its activities.'
    },
    {
      icon: Music,
      title: 'Lutheran Choir',
      description: 'Our church is blessed with talented singers and Musicians. The Parish Pastor, Rev. Dr. G. Jeevan Kumar, has initiated a Choir for the Church in May 2023 by bringing both the singers and musicians onto a single platform. Mr. Pitta David Johnson and Mr. B. Joy Calvin, Musicians with their team, attend to the Orchestra requirements of the Church with utmost dedication.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section 
        className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url(https://images.unsplash.com/photo-1604443830970-05ac4193ada9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb25ncmVnYXRpb24lMjB3b3JzaGlwfGVufDF8fHx8MTc2Mjc5OTExM3ww&ixlib=rb-4.1.0&q=80&w=1080)`,
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Church className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white">LC Hyderabad</h1>
          </div>
          <h2 className="text-blue-100 mb-2">Lutheran Church, Lakdi-ka-Pul, Hyderabad</h2>
          <p className="text-blue-200">"A-1" Parish, Hyderabad-500 004</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Title Section */}
            <div className="text-center mb-12">
              <h2 className="text-blue-900 mb-2">Brief History from 1964 – 2024</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto"></div>
            </div>

            {/* History Introduction */}
            <div className="mb-16">
              <Card className="border-green-100 shadow-lg overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4 text-slate-700">
                      <p>
                        Andhra Pradesh state with its Head Quarters at Hyderabad was formed in the year 1956. Many Lutheran Christian families from Andhra were relocated at Hyderabad. Some of the families felt the need of Lutheran Liturgy and started pursuing the issue.
                      </p>
                      
                      <p>
                        Consequently, Late B. Devadattam, P. Charles, M. David John, B. John Victor, Kale Aaron, K. Kamalaiah, B. Ananda Rao, P.A. James, V. Moses, P. J. Subhamani, P. Prasada Rao and others gathered and decided prayerfully to start a Lutheran Church. The Worship was first started at the Methodist Boys High School, Abids, Hyderabad from the year 1960 with the help of the then Principal Rev. Ch. Luke.
                      </p>

                      <p>
                        Later the Church was conducted at the YMCA, Hyderabad for some time. The Church was also held at the CSI Hindustani Church, Abids, Hyderabad till it was started at the present premises.
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <ImageWithFallback
                        src="https://lutheranchurchhyd.org/wp-content/uploads/2024/12/CHR00142.webp"
                        alt="Lutheran Church Hyderabad"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Establishment */}
            <div className="mb-16">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-100">
                <h3 className="text-blue-900 mb-6">Establishment of Lutheran Centre</h3>
                <div className="space-y-4 text-slate-700">
                  <p>
                    Rev. Dr. J. Fredrick Neuoderffer, Executive Secretary of the Board of World Missions of the Lutheran Churches in America visited Hyderabad and with the help of Dr. Clark C. Fry, President, Lutheran Churches in America, secured funds – Rs.1,20,000/- to purchase the old Medical School Building with land belonging to a Nawab at the present site in the year 1962.
                  </p>

                  <p>
                    With the generous contributions of Rs.50,000/- collected by the members, the old building was remodelled and renovated as Nativity Church. The renovated and remodelled old Church Building was named as <span className="font-semibold text-blue-900">"Lutheran Centre"</span> and was dedicated on <span className="font-semibold text-blue-900">16th February 1964</span> by Rev. Dr. J. Fredrick Neuoderffer, South Asia Secretary, Board of World Missions of Lutheran Churches in America.
                  </p>

                  <p>
                    With all the concerted efforts made by the senior members and many other members, the existing new Church was constructed and dedicated to the Glory of God on <span className="font-semibold text-blue-900">30th September 1990</span> by Rev. Dr. K. Nathaniel, President, AELC, Guntur.
                  </p>

                  <p>
                    Mr. Pilli David Nath from Guntur was the Architect for construction of this new mammoth Church. It is pertinent to mention that Sri B. Devadattam played a vital role and dedicated his services to establish the Church.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Milestones */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Church className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">1964</h3>
                    <p className="text-slate-600">Lutheran Centre Dedicated</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">31 Congregations</h3>
                    <p className="text-slate-600">Established in Hyderabad</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">2014</h3>
                    <p className="text-slate-600">Golden Jubilee Celebration</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pastors Section */}
            <div className="mb-16">
              <Card className="border-green-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-blue-900 mb-6">Pastors Who Served</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6">
                    <p className="text-slate-700">
                      Rev. Thumati Joseph, Rev. Bhushana Rao, Rev. Lam Charles, Rev. Borugadda Sundara Rao, Rev. D. V. Daniel, Rev. Vemuri Prabhakar Rao, Rev. Yesudas, Rev. Simon, Rev. M. Victor Paul, Rev. G. Sampoorna Rao, Rev. Chebrol Yesupadam, Rev. Dr. B. C. Paul, Rev. Dr. G.S. Vijayakar, Rev. Ch. Elia, Rev. Dr. B. W. David Raju, Rev. B. Gnana Manohar, Rev. G. Joshi Babu, Rev. Dr. Nakka Victor Luther Paul, Rev. Devararapalli Yesuratnam, Rev. K. R. Paul Wellington, Rev. B. Joseph, Rev. G. J. Moses, and <span className="font-semibold text-blue-900">Rev. Dr. Govada Jeevan Kumar</span> (Current Parish Pastor).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Ministry Team */}
            <div className="mb-16">
              <h2 className="text-blue-900 mb-8 text-center">Current Ministry Leadership</h2>
              <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-blue-900 mb-4 flex items-center gap-2">
                      <Church className="w-5 h-5" />
                      Parish Pastor & Associate Pastors
                    </h4>
                    <div className="space-y-2 text-slate-700">
                      <p className="font-semibold text-blue-900">Rev. Dr. G. Jeevan Kumar - Parish Pastor</p>
                      <div className="text-sm space-y-1 pl-4">
                        <p>• Rev. Dr. D. S. V. Finney</p>
                        <p>• Rev. K. Prem Kumar</p>
                        <p>• Rev. K.V. Prasanna Kumar</p>
                        <p>• Rev. S Angela Veronica</p>
                        <p>• Rev. Mentay Sunil</p>
                        <p>• Rev. G. Chenchaiah</p>
                        <p>• Rev. Gnana Prakash Rao Nakka</p>
                        <p>• Rev. Bonigala Mani Kumar</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Ad-hoc Committee Members
                    </h4>
                    <div className="text-sm space-y-1 text-slate-700">
                      <p>• Mr. R.J.H. Harrison</p>
                      <p>• Mr. Bhoopathy Raju</p>
                      <p>• Mr. J. Bhagavandas</p>
                      <p>• Mr. M. Sangeetha Rao</p>
                      <p>• Mr. J. John Wesley</p>
                      <p>• Mr. Elisha Martin</p>
                      <p>• Mr. R. John Diwakar</p>
                      <p>• Mr. P. Sanjay Prasad</p>
                      <p>• Mr. G. Kenny Babu</p>
                      <p>• Mr. G. Franklin</p>
                      <p>• And many more dedicated members...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ministry Programs */}
            <div className="mb-16">
              <h2 className="text-blue-900 mb-8 text-center">Ministry of Lutheran Church, Hyderabad "A-1" Parish</h2>
              <p className="text-slate-700 text-center mb-12 max-w-3xl mx-auto">
                In an effort to cater to the needs of the Congregation of the Lutheran Church, the congregation is segregated into various fellowships to understand their needs and to cater them in a more effective and meaningful way to enjoy in God, apart from the regular worship services.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {ministries.map((ministry, index) => (
                  <Card key={index} className="border-green-100 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <ministry.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-blue-900 mb-3 flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-green-600" />
                            {ministry.title}
                          </h4>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {ministry.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Legacy & Impact */}
            <div className="mb-8">
              <Card className="border-green-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8">
                  <h3 className="text-white mb-6 text-center">Grace of God & Legacy</h3>
                  <div className="space-y-4">
                    <p>
                      God's mighty power helped us to support the Sister Congregations in many ways to help them survive and to be established in ministry in Hyderabad. <span className="font-semibold">A total of 31 congregations in Hyderabad were established</span> by the unequalled support of the Parish Pastors, PCCs, Ad-hoc Committees, Elders and the Congregation. Among these 31 Congregations, 25 congregations are already blessed with Church Buildings.
                    </p>

                    <p>
                      The present Lutheran Church emerged stronger from lots of trials and tribulations by the Grace of God and by the prayers of so many strong believers. Their prayers and faith in Lord Jesus Christ has lifted up the present day Church and is a living example.
                    </p>

                    <p>
                      Many Developmental Works involving lakhs of rupees have been taken up in the Church during the last one year with the generous contributions and sponsorship from the members among the Congregation with the concerted persuasion of the Parish Pastor, Associate Pastors and the Ad-hoc Committee Members.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}