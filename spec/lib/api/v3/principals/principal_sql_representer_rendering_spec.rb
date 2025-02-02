#  OpenProject is an open source project management software.
#  Copyright (C) 2010-2022 the OpenProject GmbH
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License version 3.
#
#  OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
#  Copyright (C) 2006-2013 Jean-Philippe Lang
#  Copyright (C) 2010-2013 the ChiliProject Team
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 2
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
#  See COPYRIGHT and LICENSE files for more details.

require 'spec_helper'

describe ::API::V3::Principals::PrincipalSqlRepresenter, 'rendering' do
  include ::API::V3::Utilities::PathHelper

  subject(:json) do
    ::API::V3::Utilities::SqlRepresenterWalker
      .new(scope,
           current_user:,
           url_query: { select: })
      .walk(described_class)
      .to_json
  end

  let(:scope) do
    Principal
      .where(id: rendered_principal.id)
  end

  let(:group) { create(:group) }
  let(:placeholder_user) { create(:placeholder_user) }

  let(:select) { { '*' => {} } }

  current_user do
    create(:user)
  end

  context 'when rendering all supported properties for a group' do
    let(:rendered_principal) { group }

    let(:expected) do
      {
        _type: "Group",
        id: group.id,
        name: group.name,
        _links: {
          self: {
            href: api_v3_paths.group(group.id),
            title: group.name
          }
        }
      }
    end

    it 'renders as expected' do
      expect(json)
        .to be_json_eql(expected.to_json)
    end
  end

  context 'when rendering all supported properties for a placeholder user' do
    let(:rendered_principal) { placeholder_user }

    let(:expected) do
      {
        _type: "PlaceholderUser",
        id: placeholder_user.id,
        name: placeholder_user.name,
        _links: {
          self: {
            href: api_v3_paths.placeholder_user(placeholder_user.id),
            title: placeholder_user.name
          }
        }
      }
    end

    it 'renders as expected' do
      expect(json)
        .to be_json_eql(expected.to_json)
    end
  end

  context 'when rendering all supported properties for a user' do
    let(:rendered_principal) { current_user }

    let(:expected) do
      {
        _type: "User",
        id: current_user.id,
        name: current_user.name,
        firstname: current_user.firstname,
        lastname: current_user.lastname,
        _links: {
          self: {
            href: api_v3_paths.user(current_user.id),
            title: current_user.name
          }
        }
      }
    end

    it 'renders as expected' do
      expect(json)
        .to be_json_eql(expected.to_json)
    end
  end

  context 'when rendering only the name property for a user' do
    let(:rendered_principal) { current_user }
    let(:select) { { 'name' => {} } }

    let(:expected) do
      {
        name: current_user.name
      }
    end

    it 'renders as expected' do
      expect(json)
        .to be_json_eql(expected.to_json)
    end
  end
end
